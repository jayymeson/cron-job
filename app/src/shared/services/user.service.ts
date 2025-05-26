import { Injectable, Inject, Logger } from '@nestjs/common';
import { IUserRepository } from '../../apps/users/interfaces';
import { User } from '../../apps/users/entities/user.entity';
import { CreateUserDto } from '../../apps/users/dto/create-user.dto';
import { UpdateUserDto } from '../../apps/users/dto/update-user.dto';
import {
  UserNotFoundException,
  UserAlreadyExistsException,
  UserUpdateFailedException,
} from '../exceptions';
import { PaginationQuery, ResponseServicePagination } from '../../common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    this.logger.debug(`Found ${users.length} users`);
    return users;
  }

  async findAllPaginated(
    pagination: PaginationQuery,
  ): Promise<ResponseServicePagination<User>> {
    const users = await this.userRepository.findAll();
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    this.logger.debug(
      `Found ${paginatedUsers.length} users (page ${pagination.page})`,
    );

    return {
      data: paginatedUsers,
      totalItems: users.length,
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UserAlreadyExistsException(createUserDto.email);
    }

    const user = await this.userRepository.create(createUserDto);
    this.logger.log(`📝 Created new user: ${user.email}`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    try {
      Object.assign(user, updateUserDto);
      const updatedUser = await this.userRepository.update(user);
      this.logger.log(`📝 Updated user: ${updatedUser.email}`);
      return updatedUser;
    } catch (error) {
      throw new UserUpdateFailedException(id, error.message);
    }
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id); // Check if user exists
    await this.userRepository.delete(id);
    this.logger.log(`🗑️  Deleted user: ${user.email}`);
  }

  async findActiveUsers(): Promise<User[]> {
    const users = await this.userRepository.findActiveUsers();
    this.logger.debug(`Found ${users.length} active users`);
    return users;
  }

  async updateTimestamp(user: User): Promise<User> {
    try {
      const updatedUser = await this.userRepository.update(user);
      this.logger.debug(`⏱️  Updated timestamp for user: ${user.email}`);
      return updatedUser;
    } catch (error) {
      throw new UserUpdateFailedException(user.id, 'timestamp update failed');
    }
  }
}
