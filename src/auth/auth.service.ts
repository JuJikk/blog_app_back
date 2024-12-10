import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async register(email: string, password: string) {
    return this.userService.register(email, password);
  }

  async generateToken(user: any): Promise<string> {
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async validatePassword(
    inputPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
