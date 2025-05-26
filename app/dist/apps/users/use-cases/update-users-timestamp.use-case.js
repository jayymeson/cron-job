"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UpdateUsersTimestampUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUsersTimestampUseCase = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const user_service_1 = require("../../../shared/services/user.service");
let UpdateUsersTimestampUseCase = UpdateUsersTimestampUseCase_1 = class UpdateUsersTimestampUseCase {
    constructor(userService, schedulerRegistry) {
        this.userService = userService;
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(UpdateUsersTimestampUseCase_1.name);
        this.updateUsersJob = '*/5 * * * *';
    }
    async onModuleInit() {
        const updateUsersJob = new cron_1.CronJob(this.updateUsersJob, () => this.updateUsersTimestamp());
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
        }
        catch (error) {
            this.logger.error('Error updating users timestamp', error);
        }
    }
};
exports.UpdateUsersTimestampUseCase = UpdateUsersTimestampUseCase;
exports.UpdateUsersTimestampUseCase = UpdateUsersTimestampUseCase = UpdateUsersTimestampUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        schedule_1.SchedulerRegistry])
], UpdateUsersTimestampUseCase);
//# sourceMappingURL=update-users-timestamp.use-case.js.map