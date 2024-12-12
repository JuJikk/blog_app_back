import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/posts.entity';
import { CommentEntity } from './entities/comments.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UserEntity } from '../users/entities/users.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: string) {
    console.log('Creating post...');

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const post = this.postRepo.create({
      ...createPostDto,
      user, // Pass the full user entity
    });

    console.log(post, 'Post created');

    return await this.postRepo.save(post);
  }

  async getUserPosts(userId: string) {
    return this.postRepo.find({
      where: { user: { id: userId } },
      relations: ['comments'], // Include related entities if needed
    });
  }

  async getAllPosts() {
    return await this.postRepo.find({
      relations: ['user', 'comments'],
    });
  }

  async updatePost(postId: number, updatePostDto: CreatePostDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== updatePostDto.user)
      throw new ForbiddenException('You cannot update this post');
    // delete updatePostDto.user;
    // delete updatePostDto.updatedPost.comments;
    // console.log(post, "POST");
    // console.log(updatePostDto, "DTO");
    // @ts-ignore
    console.log(updatePostDto);
    console.log(post.title, updatePostDto.title);
    console.log(post.content, updatePostDto.content);

    post.title = updatePostDto.title;
    post.content = updatePostDto.content;
    // const updatePostDtoWithoutEmail = updatePostDto.delete
    // Object.assign(post, updatePostDto);
    console.log(post);
    return this.postRepo.save(post);
  }

  async deletePost(postId: number, userId: string) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['comments'],
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== userId)
      throw new ForbiddenException('You cannot delete this post');

    await this.commentRepo.delete({ post: { id: postId } });

    return this.postRepo.remove(post);
  }

  async getPostById(postId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['user', 'comments'], // Include relations if necessary
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async addComment(postId: number, content: string, userId: string) {
    console.log(postId, content, userId, 'qweqweqweqwe');
    if (!content || content.trim() === '') {
      throw new Error('Content cannot be empty');
    }

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentRepo.create({
      content,
      post,
      user: { id: userId },
    });
    return this.commentRepo.save(comment);
  }

  async getComments(postId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['comments'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post.comments;
  }
}
