import { Module } from '@nestjs/common';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/posts.entity';
import { CommentEntity } from './entities/comments.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, CommentEntity]),
    AuthModule,
    UsersModule,
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostsModule {}
