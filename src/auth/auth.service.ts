import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: { username: string; password: string }) {
    const { username, password } = credentials;
    
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
    return null;
  }

  async register(username: string, password: string, email: string) {
   
  }
}