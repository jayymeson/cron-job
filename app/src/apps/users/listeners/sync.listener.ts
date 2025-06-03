import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SyncCompletedEvent } from '../events/sync.events';

@Injectable()
export class SyncEventListener {
  private readonly logger = new Logger(SyncEventListener.name);

  @OnEvent('sync.started')
  handleSyncStarted() {
    this.logger.log('Synchronization process started');
  }

  @OnEvent('sync.completed')
  handleSyncCompleted(event: SyncCompletedEvent) {
    this.logger.log(
      `Synchronization completed successfully:
      - Duration: ${event.duration}ms
      - Created: ${event.created}
      - Updated: ${event.updated}
      - Strategy: ${event.strategy}`,
    );
  }

  @OnEvent('sync.failed')
  handleSyncFailed(error: Error) {
    this.logger.error('Synchronization failed:', error);
  }

  @OnEvent('sync.circuit.opened')
  handleCircuitOpened() {
    this.logger.warn(
      'Circuit breaker opened - synchronization temporarily disabled',
    );
  }

  @OnEvent('sync.circuit.halfOpened')
  handleCircuitHalfOpened() {
    this.logger.log('Circuit breaker half-opened - testing synchronization');
  }

  @OnEvent('sync.circuit.closed')
  handleCircuitClosed() {
    this.logger.log('Circuit breaker closed - synchronization resumed');
  }
}
