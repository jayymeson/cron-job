import { Injectable, Inject } from '@nestjs/common';
import { ISyncStrategy } from '../sync-strategy.interface';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../interfaces/user-repository.interface';

@Injectable()
export class FullSyncStrategy implements ISyncStrategy {
  name = 'full-sync';
  description = 'Synchronizes all users by clearing the target database first';

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

    try {
      await this.userRepository.clear();

      const createdUsers = await this.userRepository.bulkUpsert(users);
      result.created = createdUsers.length;
    } catch (error) {
      result.errors.push(error);
    }

    return result;
  }
}
