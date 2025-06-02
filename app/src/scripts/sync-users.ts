import { createConnection } from 'typeorm';
import { User } from '../apps/users/entities/user.entity';

async function bootstrap() {
  let externalConnection;
  let localConnection;

  try {
    // Connect to external database
    externalConnection = await createConnection({
      name: 'external',
      type: 'postgres',
      host: process.env.EXTERNAL_DB_HOST || 'external-postgres',
      port: parseInt(process.env.EXTERNAL_DB_PORT || '5432'),
      username: process.env.EXTERNAL_DB_USERNAME || 'external_user',
      password: process.env.EXTERNAL_DB_PASSWORD || 'external_pass',
      database: process.env.EXTERNAL_DB_NAME || 'external_db',
    });

    // Connect to local database
    localConnection = await createConnection({
      name: 'local',
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'postgres-service',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'cronjob_db',
      entities: [User],
      synchronize: true,
    });

    console.log('Connected to both databases');

    // Get users from external database
    const externalUsers = await externalConnection.query('SELECT * FROM users');
    console.log(`Found ${externalUsers.length} users in external database`);

    // Get local repository
    const userRepository = localConnection.getRepository(User);

    let created = 0;
    let updated = 0;

    // Sync users
    for (const externalUser of externalUsers) {
      const existingUser = await userRepository.findOne({
        where: { email: externalUser.email },
      });

      if (existingUser) {
        // Update existing user
        await userRepository.update(existingUser.id, {
          name: externalUser.name,
          isActive: externalUser.is_active,
          updatedAt: new Date(),
        });
        updated++;
      } else {
        // Create new user
        await userRepository.save({
          name: externalUser.name,
          email: externalUser.email,
          isActive: externalUser.is_active,
        });
        created++;
      }
    }

    console.log(
      `Sync completed: Created ${created} users, Updated ${updated} users`,
    );
    process.exit(0);
  } catch (error) {
    console.error('Failed to sync users:', error);
    process.exit(1);
  } finally {
    if (externalConnection) {
      await externalConnection.close();
    }
    if (localConnection) {
      await localConnection.close();
    }
  }
}

bootstrap();
