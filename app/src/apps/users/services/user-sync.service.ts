import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createConnection } from 'typeorm';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserSyncService {
  private readonly logger = new Logger(UserSyncService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async syncFromExternalDb() {
    const startTime = Date.now();
    this.logger.log('Starting sync process...');

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

      let created = 0;
      let updated = 0;

      for (const externalUser of externalUsers) {
        this.logger.log(`Processing user: ${externalUser.email}`);
        const existingUser = await this.userRepository.findOne({
          where: { email: externalUser.email },
        });

        if (existingUser) {
          this.logger.log(`Updating user: ${externalUser.email}`);
          await this.userRepository.update(existingUser.id, {
            name: externalUser.name,
            isActive: externalUser.isActive,
            updatedAt: new Date(),
          });
          updated++;
        } else {
          this.logger.log(`Creating user: ${externalUser.email}`);
          await this.userRepository.save({
            ...externalUser,
            id: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          created++;
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `Sync completed in ${duration}ms. Created: ${created}, Updated: ${updated}`,
      );
    } catch (error) {
      this.logger.error('Error during sync:', error);
      process.exit(1);
    } finally {
      await externalConnection.close();
    }
  }
}
