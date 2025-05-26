import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { UserService } from '../../../shared/services/user.service';

@Injectable()
export class UpdateUsersTimestampUseCase implements OnModuleInit {
  private readonly logger = new Logger(UpdateUsersTimestampUseCase.name);
  private updateUsersJob: string;

  constructor(
    private readonly userService: UserService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.updateUsersJob = CronExpression.EVERY_5_SECONDS;
  }

  async onModuleInit() {
    const updateUsersJob = new CronJob(this.updateUsersJob, () =>
      this.updateUsersTimestamp(),
    );

    this.schedulerRegistry.addCronJob('updateUsersTimestamp', updateUsersJob);

    updateUsersJob.start();

    this.logger.log('Cron job "updateUsersTimestamp" started successfully');
  }

  async updateUsersTimestamp() {
    this.logger.log('START UPDATE USERS TIMESTAMP');

    try {
      const activeUsers = await this.userService.findActiveUsers();

      this.logger.log(`Found ${activeUsers.length} active users to update`);

      for (const user of activeUsers) {
        await this.userService.updateTimestamp(user);
        this.logger.log(`Updated timestamp for user: ${user.email}`);
      }

      this.logger.log('FINISH UPDATE USERS TIMESTAMP');
    } catch (error) {
      this.logger.error('Error updating users timestamp', error);
    }
  }
}
