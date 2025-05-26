import { IUserRepository } from '../../apps/users/interfaces';
import { User } from '../../apps/users/entities/user.entity';
import { CreateUserDto } from '../../apps/users/dto/create-user.dto';
import { UpdateUserDto } from '../../apps/users/dto/update-user.dto';
import { PaginationQuery, ResponseServicePagination } from '../../common';
export declare class UserService {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: IUserRepository);
    findAll(): Promise<User[]>;
    findAllPaginated(pagination: PaginationQuery): Promise<ResponseServicePagination<User>>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    delete(id: string): Promise<void>;
    findActiveUsers(): Promise<User[]>;
    updateTimestamp(user: User): Promise<User>;
}
