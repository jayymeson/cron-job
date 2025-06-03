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
  const app = await NestFactory.create(AppModule);
  const syncService = app.get(UserSyncService);

  await syncService.startSync('incremental');

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await app.close();
}

bootstrap();
