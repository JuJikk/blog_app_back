import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthDto } from './dtos/auth.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User signup payload',
    type: AuthDto,
  })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'User already exists.' })
  async signup(@Body() body: AuthDto) {
    try {
      const token = await this.authService.register(body.email, body.password);
      return { token };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiBody({
    description: 'User login payload',
    type: AuthDto,
  })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() body: AuthDto) {
    try {
      const token = await this.authService.login(body.email, body.password);
      return { token };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
