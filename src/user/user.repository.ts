import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto'; 

export class UserRepository extends Repository<User> {
  async findByUsername(username: string): Promise<User> {
    return this.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  async createUser(username: string, password: string, email: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.email = email;
    const hashedPassword = await this.hashPassword(password);  
    user.password = hashedPassword;
    return await this.save(user);
  }

  private async hashPassword(password: string): Promise<string> {
    // sинхронное хеширование с использованием криптографии
    return crypto.createHash('sha256').update(password).digest('hex');
  }
}
