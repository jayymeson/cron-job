import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserController } from '../../infra/controllers/user.controller';
import { UserService } from '../../shared/services/user.service';
import { UserRepository } from '../../infra/repositories/user.repository';
import { UpdateUsersTimestampUseCase } from './use-cases/update-users-timestamp.use-case';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ScheduleModule.forRoot()],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UpdateUsersTimestampUseCase,
  ],
  exports: [UserService],
})
export class UsersModule {}
