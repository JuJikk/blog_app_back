import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Content of the comment, including the text',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID of the user creating the comment',
    example: '2ed7ae2c-bd1c-4c27-ad79-8be9e12bb580',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
