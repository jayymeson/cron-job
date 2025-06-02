import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './apps/users/users.module';
import { getDatabaseConfig } from './infra/database/database.config';
import { appConfig, paginationConfig } from './shared/config';
import { SyncController } from './infra/controllers/sync.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, paginationConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),
    UsersModule,
  ],
  controllers: [AppController, SyncController],
  providers: [AppService],
})
export class AppModule {}
