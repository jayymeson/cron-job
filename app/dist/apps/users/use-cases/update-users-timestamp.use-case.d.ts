import { OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserService } from '../../../shared/services/user.service';
export declare class UpdateUsersTimestampUseCase implements OnModuleInit {
    private readonly userService;
    private readonly schedulerRegistry;
    private readonly logger;
    private updateUsersJob;
    constructor(userService: UserService, schedulerRegistry: SchedulerRegistry);
    onModuleInit(): Promise<void>;
    updateUsersTimestamp(): Promise<void>;
}
