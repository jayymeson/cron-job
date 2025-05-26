import { User } from '../entities/user.entity';
export interface IUserRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    findActiveUsers(): Promise<User[]>;
}
