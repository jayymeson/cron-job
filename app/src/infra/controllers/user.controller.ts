import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../shared/services/user.service';
import { CreateUserDto } from '../../apps/users/dto/create-user.dto';
import { UpdateUserDto } from '../../apps/users/dto/update-user.dto';
import {
  Pagination,
  ValidationGuard,
  ApiPaginatedResponse,
  ApiLoggedResponse,
  PaginationQuery,
} from '../../common';

@Controller('users')
@ApiLoggedResponse()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(ValidationGuard)
  @ApiPaginatedResponse()
  findAllPaginated(@Pagination() pagination: PaginationQuery) {
    return this.userService.findAllPaginated(pagination);
  }

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('status/active')
  findActiveUsers() {
    return this.userService.findActiveUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
