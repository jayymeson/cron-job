import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserRepository } from '../../infra/repositories/user.repository';
import { User } from './entities/user.entity';
import { UserSyncService } from './services/user-sync.service';
import { FullSyncStrategy } from './services/sync-strategies/full-sync.strategy';
import { IncrementalSyncStrategy } from './services/sync-strategies/incremental-sync.strategy';
import { SyncEventListener } from './listeners/sync.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [
    UserSyncService,
    FullSyncStrategy,
    IncrementalSyncStrategy,
    SyncEventListener,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UserSyncService],
})
export class UsersModule {}
