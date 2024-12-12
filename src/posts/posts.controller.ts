import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Patch,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from './posts.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { ApiJwtPayload, GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({
    description: 'Payload for creating a new post',
    type: CreatePostDto,
  })
  @ApiResponse({ status: 201, description: 'Post successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createPost(@Body() createPostDto: CreatePostDto, @GetUser() user: ApiJwtPayload) {
    return this.postService.createPost(createPostDto, user.userId);
  }

  @Get('my-posts')
  @ApiOperation({
    summary: 'Retrieve posts created by the user (from query param)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user posts',
  })
  async getUserPosts(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.postService.getUserPosts(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiParam({ name: 'id', description: 'ID of the post to update' })
  @ApiBody({
    description: 'Payload for updating a post',
    type: CreatePostDto,
  })
  @ApiResponse({ status: 200, description: 'Post successfully updated' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async updatePost(@Param('id') postId: number, @Body() updatePostDto: CreatePostDto, @GetUser() user: ApiJwtPayload) {
    return await this.postService.updatePost(postId, updatePostDto, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'ID of the post to delete' })
  @ApiResponse({ status: 200, description: 'Post successfully deleted' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async deletePost(@Param('id') postId: number, @Body() userId: { userId: string }) {
    return this.postService.deletePost(postId, userId.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single post by ID' })
  @ApiParam({ name: 'id', description: 'ID of the post to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the post',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostById(@Param('id') postId: number) {
    return this.postService.getPostById(postId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiParam({ name: 'id', description: 'ID of the post to add a comment' })
  @ApiBody({
    description: 'Payload for adding a comment',
    type: CreateCommentDto,
  })
  @ApiResponse({ status: 201, description: 'Comment successfully added' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async addComment(@Param('id') postId: number, @Body() body: CreateCommentDto) {
    return this.postService.addComment(postId, body.content, body.userId);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Retrieve all comments for a post' })
  @ApiParam({ name: 'id', description: 'ID of the post' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved comments',
    type: [CreateCommentDto],
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getComments(@Param('id') postId: number) {
    return this.postService.getComments(postId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all posts' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all posts',
  })
  async getAllPosts() {
    return this.postService.getAllPosts();
  }
}
