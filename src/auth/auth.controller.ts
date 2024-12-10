import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Регистрация пользователя
  @Post('register')
  async register(@Body() body: { username: string; password: string; email: string }) {
    const { username, password, email } = body;
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    return await this.authService.register(username, password, email);
  }

  // Логин и генерация токена
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return await this.authService.login({ username, password });
  }
}


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', 
      signOptions: { expiresIn: '60s' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}