import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthDto } from './dtos/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User signup payload',
    type: AuthDto,
  })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'User already exists.' })
  async signup(@Body() body: AuthDto) {
    const userExists = await this.userService.findByEmail(body.email);
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.authService.hashPassword(body.password);
    const user = await this.userService.create(body.email, hashedPassword);
    return { token: await this.authService.generateToken(user) };
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({
    description: 'User login payload',
    type: AuthDto,
  })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() body: AuthDto) {
    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.authService.validatePassword(
      body.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return { token: await this.authService.generateToken(user) };
  }
}
