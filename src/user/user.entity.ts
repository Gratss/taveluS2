import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Trip } from '../trip/trip.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'default_username' })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isBlocked: boolean;

  @OneToMany(() => Trip, trip => trip.user)
  trips: Trip[];
}
