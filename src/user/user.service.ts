import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    const user = this.userRepository.create({
      username: name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
    });
    const savedUser = await this.userRepository.save(user);

    await this.sendVerificationEmail(email, verificationToken);
    return savedUser;
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { emailVerificationToken: token } });
    if (!user) throw new NotFoundException('Invalid verification token');
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const verificationLink = `${process.env.APP_URL}/users/verify-email/${token}`;

    await transporter.sendMail({
      to: email,
      subject: 'Email Verification',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async blockUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.isBlocked = true;
    return await this.userRepository.save(user);
  }
}
