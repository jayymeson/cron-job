import { createConnection } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '../../apps/users/entities/user.entity';

async function seedExternalDb() {
  try {
    const connection = await createConnection({
      name: 'external-seed',
      type: 'postgres',
      host: process.env.EXTERNAL_DB_HOST || 'external_postgres',
      port: parseInt(process.env.EXTERNAL_DB_PORT || '5432'),
      username: process.env.EXTERNAL_DB_USERNAME || 'external_user',
      password: process.env.EXTERNAL_DB_PASSWORD || 'external_pass',
      database: process.env.EXTERNAL_DB_NAME || 'external_db',
      entities: [User],
      synchronize: true,
    });

    const users = Array.from({ length: 50 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }));

    await connection.getRepository(User).save(users);

    await connection.close();
  } catch (error) {
    process.exit(1);
  }
}

seedExternalDb();
