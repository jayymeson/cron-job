import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import CircuitBreaker = require('opossum');
import { createConnection } from 'typeorm';
import { User } from '../entities/user.entity';
import { ISyncStrategy } from './sync-strategy.interface';
import { FullSyncStrategy } from './sync-strategies/full-sync.strategy';
import { IncrementalSyncStrategy } from './sync-strategies/incremental-sync.strategy';

@Injectable()
export class UserSyncService {
  private readonly logger = new Logger(UserSyncService.name);
  private readonly circuitBreaker: CircuitBreaker;
  private isSyncEnabled = false;
  private currentStrategy: ISyncStrategy;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly fullSyncStrategy: FullSyncStrategy,
    private readonly incrementalSyncStrategy: IncrementalSyncStrategy,
  ) {
    this.circuitBreaker = new CircuitBreaker(
      this.syncFromExternalDb.bind(this),
      {
        timeout: 30000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000,
      },
    );

    this.setupCircuitBreakerEvents();
    this.currentStrategy = this.incrementalSyncStrategy;
  }

  private setupCircuitBreakerEvents() {
    this.circuitBreaker.on('open', () => {
      this.logger.warn('Circuit Breaker opened - stopping sync attempts');
      this.eventEmitter.emit('sync.circuit.opened');
    });

    this.circuitBreaker.on('halfOpen', () => {
      this.logger.log('Circuit Breaker half-opened - testing sync');
      this.eventEmitter.emit('sync.circuit.halfOpened');
    });

    this.circuitBreaker.on('close', () => {
      this.logger.log('Circuit Breaker closed - sync resumed');
      this.eventEmitter.emit('sync.circuit.closed');
    });
  }

  setStrategy(strategy: 'full' | 'incremental') {
    this.currentStrategy =
      strategy === 'full'
        ? this.fullSyncStrategy
        : this.incrementalSyncStrategy;

    this.logger.log(`Sync strategy set to: ${this.currentStrategy.name}`);
  }

  async startSync(strategy: 'full' | 'incremental' = 'incremental') {
    this.setStrategy(strategy);
    this.isSyncEnabled = true;
    this.logger.log(
      `Starting sync with strategy: ${this.currentStrategy.name}`,
    );
    return this.circuitBreaker.fire();
  }

  stopSync() {
    this.isSyncEnabled = false;
    this.logger.log('Sync service disabled');
  }

  // Agora é público para permitir chamadas diretas
  async syncFromExternalDb() {
    if (!this.isSyncEnabled) {
      this.logger.debug('Sync is disabled, skipping...');
      return;
    }

    const startTime = Date.now();
    this.logger.log('Starting sync process...');
    this.eventEmitter.emit('sync.started');

    const externalConnection = await createConnection({
      name: `external-${Date.now()}`,
      type: 'postgres',
      host: this.configService.get('EXTERNAL_DB_HOST'),
      port: this.configService.get('EXTERNAL_DB_PORT'),
      username: this.configService.get('EXTERNAL_DB_USERNAME'),
      password: this.configService.get('EXTERNAL_DB_PASSWORD'),
      database: this.configService.get('EXTERNAL_DB_NAME'),
      entities: [User],
    });

    try {
      this.logger.log('Connected to external database');
      const externalUsers = await externalConnection.getRepository(User).find();
      this.logger.log(
        `Found ${externalUsers.length} users in external database`,
      );

      const result = await this.currentStrategy.sync(externalUsers);

      const duration = Date.now() - startTime;
      this.logger.log(
        `Sync completed in ${duration}ms. Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors.length}`,
      );

      if (result.errors.length > 0) {
        this.eventEmitter.emit('sync.errors', result.errors);
      }

      this.eventEmitter.emit('sync.completed', {
        duration,
        created: result.created,
        updated: result.updated,
        strategy: this.currentStrategy.name,
      });
    } catch (error) {
      this.logger.error('Error during sync:', error);
      this.eventEmitter.emit('sync.failed', error);
      throw error;
    } finally {
      await externalConnection.close();
    }
  }
}
