import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { UserService } from '../services/user.service';

async function seed() {
  const logger = new Logger('DatabaseSeed');
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const users = [
    {
      name: 'João Silva',
      email: 'joao@example.com',
    },
    {
      name: 'Maria Santos',
      email: 'maria@example.com',
    },
    {
      name: 'Pedro Oliveira',
      email: 'pedro@example.com',
    },
    {
      name: 'Ana Costa',
      email: 'ana@example.com',
    },
  ];

  logger.log('🌱 Starting database seeding...');

  for (const userData of users) {
    try {
      const user = await userService.create(userData);
      logger.log(`✅ Created user: ${user.name} (${user.email})`);
    } catch (error) {
      logger.warn(
        `⚠️  User ${userData.email} already exists or error occurred`,
      );
    }
  }

  logger.log('🎉 Database seeding completed!');
  await app.close();
}

seed().catch((error) => {
  const logger = new Logger('DatabaseSeed');
  logger.error('❌ Seeding failed:', error);
  process.exit(1);
});
