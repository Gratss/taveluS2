import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { TripService } from './trip/trip.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tripService: TripService,
  ) {}

  // Авторизация пользователя
  async login(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid username or password');
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  // Регистрация пользователя
  async register(username: string, password: string, email: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser(username, email, hashedPassword);
  }

  // Фильтрация поездок
  async filterTrips(destination?: string, date?: string, vehicle?: string) {
    return this.tripService.filterTrips(destination, date, vehicle);
  }

  // Поиск попутчиков
  async findCarpoolers(tripId: number) {
    return this.tripService.findCarpoolers(tripId);
  }

  // Получение деталей поездки
  async getTripDetails(tripId: number) {
    return this.tripService.getCarpoolDetails(tripId);
  }

  // Тестовый метод
  getHello(): string {
    return 'Hello World!';
  }
}
