import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'user@example.com', description: 'The user email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongP@ss123', description: 'The user password' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
