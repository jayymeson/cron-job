import { randomUUID } from 'crypto';
if (!globalThis.crypto) {
  globalThis.crypto = {
    randomUUID: randomUUID,
  } as any;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserSyncService } from '../apps/users/services/user-sync.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userSyncService = app.get(UserSyncService);

  try {
    await userSyncService.syncFromExternalDb();
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Failed to sync users:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
