import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // создание юзера
  async createUser(name: string, email: string, password: string): Promise<User> {
    const user = new User();
    user.username = name; 
    user.email = email;
    user.password = await bcrypt.hash(password, 10); 
    return await this.userRepository.save(user);
  }

  // все пользователи
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // 1 юзер по id
  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // 1 юзер по username 
  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
}
