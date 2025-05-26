import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { UserService } from '../services/user.service';

async function seed() {
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

  console.log('🌱 Starting database seeding...');

  for (const userData of users) {
    try {
      const user = await userService.create(userData);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    } catch (error) {
      console.log(
        `⚠️  User ${userData.email} already exists or error occurred`,
      );
    }
  }

  console.log('🎉 Database seeding completed!');
  await app.close();
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
