import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../apps/users/entities/user.entity';
import { IUserRepository } from '../../apps/users/interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
    });
  }

  async bulkUpsert(users: Partial<User>[]): Promise<User[]> {
    const results: User[] = [];

    for (const user of users) {
      if (user.email) {
        const existingUser = await this.findByEmail(user.email);
        if (existingUser) {
          const updated = await this.update({
            ...existingUser,
            ...user,
            updatedAt: new Date(),
          });
          results.push(updated);
        } else {
          const created = await this.create({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          results.push(created);
        }
      }
    }

    return results;
  }

  async clear(): Promise<void> {
    await this.userRepository.clear();
  }
}
