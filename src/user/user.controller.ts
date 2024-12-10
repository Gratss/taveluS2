import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // создание 
  @Post()
  async createUser(@Body() userData: { name: string; email: string; password: string }) {
    const { name, email, password } = userData;
    return await this.userService.createUser(name, email, password);
  }

  // поиск всех 
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  // получение 1ого 
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.findOne(id);
  }
}
