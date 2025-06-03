import { Injectable, Inject } from '@nestjs/common';
import { ISyncStrategy } from '../sync-strategy.interface';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../interfaces/user-repository.interface';

@Injectable()
export class IncrementalSyncStrategy implements ISyncStrategy {
  name = 'incremental-sync';
  description =
    'Synchronizes users by updating existing records and creating new ones';

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async sync(users: User[]) {
    const result = {
      created: 0,
      updated: 0,
      errors: [] as Error[],
    };

    for (const user of users) {
      try {
        const existingUser = await this.userRepository.findByEmail(user.email);

        if (existingUser) {
          await this.userRepository.update({
            ...existingUser,
            name: user.name,
            isActive: user.isActive,
            updatedAt: new Date(),
          });
          result.updated++;
        } else {
          await this.userRepository.create({
            ...user,
            id: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          result.created++;
        }
      } catch (error) {
        result.errors.push(error);
      }
    }

    return result;
  }
}
