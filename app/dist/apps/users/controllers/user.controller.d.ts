import { UserService } from '../../../shared/services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationQuery } from '../../../common';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("../entities/user.entity").User>;
    findAllPaginated(pagination: PaginationQuery): Promise<import("../../../common").ResponseServicePagination<import("../entities/user.entity").User>>;
    findAll(): Promise<import("../entities/user.entity").User[]>;
    findActiveUsers(): Promise<import("../entities/user.entity").User[]>;
    findOne(id: string): Promise<import("../entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../entities/user.entity").User>;
    remove(id: string): Promise<void>;
}
