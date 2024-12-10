import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username: name, email, password: hashedPassword });
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, updateData: Partial<{ name: string; email: string; password: string }>): Promise<User> {
    const user = await this.findOne(id);
    if (updateData.name) user.username = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.password) user.password = await bcrypt.hash(updateData.password, 10);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async blockUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.isBlocked = true; // Добавим поле isBlocked в сущность
    return await this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } }); // Пример реализации
  }
}
