import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<string> {
    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.userService.create(email, hashedPassword);
    return this.generateToken(user);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('No such user', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.generateToken(user);
  }

  async generateToken(user: any): Promise<string> {
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async validatePassword(
    inputPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    console.log(inputPassword);
    console.log(storedPassword);
    console.log(await bcrypt.compare(inputPassword, storedPassword));
    return bcrypt.compare(inputPassword, storedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
