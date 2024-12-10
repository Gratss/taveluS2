import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Trip } from '../trip/trip.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean; // Поле для проверки email

  @Column({ nullable: true })
  emailVerificationToken: string; // Токен для подтверждения email

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];

  @Column({ default: false })
  isBlocked: boolean; // Поле для блокировки пользователя
}