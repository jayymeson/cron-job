import { User } from '../entities/user.entity';

export interface ISyncStrategy {
  name: string;
  description: string;
  sync(users: User[]): Promise<{
    created: number;
    updated: number;
    errors: Error[];
  }>;
}
