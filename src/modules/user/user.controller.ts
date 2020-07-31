import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {AuthGuard} from '@nestjs/passport';
import {Roles} from '../role/decorators/role.decorator';
import {RoleGuard} from '../role/guards/role.guard';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  @Roles('ADMIN', 'AUTHOR')
  @UseGuards(AuthGuard(), RoleGuard)
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this._userService.get(id);
    return user;
  }

  @Get()
  @UseGuards(AuthGuard())
  async getUsers(): Promise<User[]> {
    const users = await this._userService.getAll();
    return users;
  }

  @Post('create')
  async createUser(@Body() user: User): Promise<User> {
    const createdUser = await this._userService.create(user);
    return createdUser;
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User): void {
    this._userService.update(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): boolean {
    this._userService.delete(id);
    return true;
  }

  @Post('setRole/:userId/:roleId')
  /* @Roles(['ADMIN', 'GENERAL']) */
  async setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userId, roleId)
  }
}
