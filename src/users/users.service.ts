import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async register(email: string, password: string): Promise<UserEntity> {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepo.create({ email, password: hashedPassword });
    return this.userRepo.save(newUser);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async findById(userId: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(email: string, password: string): Promise<UserEntity> {
    return this.register(email, password);
  }
}
