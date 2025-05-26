import { Repository } from 'typeorm';
import { User } from '../../apps/users/entities/user.entity';
import { IUserRepository } from '../../apps/users/interfaces';
export declare class UserRepository implements IUserRepository {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    findActiveUsers(): Promise<User[]>;
}
