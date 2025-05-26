import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
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
    // Execute every 5 minutes
    this.updateUsersJob = '*/5 * * * *';
  }

  async onModuleInit() {
    const updateUsersJob = new CronJob(this.updateUsersJob, () =>
      this.updateUsersTimestamp(),
    );

    this.schedulerRegistry.addCronJob('updateUsersTimestamp', updateUsersJob);

    updateUsersJob.start();

    this.logger.log(
      `🚀 Cron job "updateUsersTimestamp" started successfully - Running every 5 minutes`,
    );
    this.logger.log(
      `⏰ Next execution will be at: ${updateUsersJob.nextDate().toLocaleString()}`,
    );
  }

  async updateUsersTimestamp() {
    const startTime = Date.now();
    this.logger.log('🔄 START UPDATE USERS TIMESTAMP');

    try {
      const activeUsers = await this.userService.findActiveUsers();

      this.logger.log(`👥 Found ${activeUsers.length} active users to update`);

      if (activeUsers.length === 0) {
        this.logger.log('ℹ️  No active users found to update');
        return;
      }

      let updatedCount = 0;
      for (const user of activeUsers) {
        try {
          await this.userService.updateTimestamp(user);
          this.logger.debug(`✅ Updated timestamp for user: ${user.email}`);
          updatedCount++;
        } catch (error) {
          this.logger.error(`❌ Failed to update user ${user.email}:`, error);
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(
        `✨ FINISH UPDATE USERS TIMESTAMP - Updated ${updatedCount}/${activeUsers.length} users in ${duration}ms`,
      );
    } catch (error) {
      this.logger.error('💥 Error updating users timestamp:', error);
    }
  }
}
