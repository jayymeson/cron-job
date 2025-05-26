"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../exceptions");
let UserService = UserService_1 = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async findAll() {
        const users = await this.userRepository.findAll();
        this.logger.debug(`Found ${users.length} users`);
        return users;
    }
    async findAllPaginated(pagination) {
        const users = await this.userRepository.findAll();
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedUsers = users.slice(startIndex, endIndex);
        this.logger.debug(`Found ${paginatedUsers.length} users (page ${pagination.page})`);
        return {
            data: paginatedUsers,
            totalItems: users.length,
        };
    }
    async findById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new exceptions_1.UserNotFoundException(id);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new exceptions_1.UserNotFoundException(email);
        }
        return user;
    }
    async create(createUserDto) {
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new exceptions_1.UserAlreadyExistsException(createUserDto.email);
        }
        const user = await this.userRepository.create(createUserDto);
        this.logger.log(`📝 Created new user: ${user.email}`);
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        try {
            Object.assign(user, updateUserDto);
            const updatedUser = await this.userRepository.update(user);
            this.logger.log(`📝 Updated user: ${updatedUser.email}`);
            return updatedUser;
        }
        catch (error) {
            throw new exceptions_1.UserUpdateFailedException(id, error.message);
        }
    }
    async delete(id) {
        const user = await this.findById(id);
        await this.userRepository.delete(id);
        this.logger.log(`🗑️  Deleted user: ${user.email}`);
    }
    async findActiveUsers() {
        const users = await this.userRepository.findActiveUsers();
        this.logger.debug(`Found ${users.length} active users`);
        return users;
    }
    async updateTimestamp(user) {
        try {
            const updatedUser = await this.userRepository.update(user);
            this.logger.debug(`⏱️  Updated timestamp for user: ${user.email}`);
            return updatedUser;
        }
        catch (error) {
            throw new exceptions_1.UserUpdateFailedException(user.id, 'timestamp update failed');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object])
], UserService);
//# sourceMappingURL=user.service.js.map