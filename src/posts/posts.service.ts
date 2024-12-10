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

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: number) {
    const post = this.postRepo.create({
      ...createPostDto,
      user: { id: userId },
    });
    return this.postRepo.save(post);
  }

  async updatePost(
    postId: number,
    updatePostDto: CreatePostDto,
    userId: number,
  ) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== userId)
      throw new ForbiddenException('You cannot update this post');

    Object.assign(post, updatePostDto);
    return this.postRepo.save(post);
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['comments'],
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== userId)
      throw new ForbiddenException('You cannot delete this post');

    // Optionally, delete comments before deleting the post (if needed)
    await this.commentRepo.delete({ post: { id: postId } });

    return this.postRepo.remove(post);
  }

  async addComment(postId: number, content: string, userId: number) {
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

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId)
      throw new ForbiddenException('You cannot delete this comment');

    return this.commentRepo.remove(comment);
  }
}
