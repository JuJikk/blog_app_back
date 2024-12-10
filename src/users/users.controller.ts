import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { UserEntity } from './entities/users.entity';
import { RegisterDto } from './dtos/register-user.dto';
import { LoginDto } from './dtos/login-user.dto';

@ApiTags('Auth') // Group endpoints under "Auth"
@Controller('auth')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ description: 'User registration payload', type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  async register(@Body() body: RegisterDto): Promise<UserEntity> {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ description: 'User login payload', type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token.',
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  async login(@Body() body: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth() // Document JWT Bearer token requirement
  @ApiResponse({
    status: 200,
    description: 'Returns user profile information.',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getProfile(@Req() req): Promise<UserEntity> {
    const userId = req.user.userId;
    return this.userService.findById(userId);
  }
}
