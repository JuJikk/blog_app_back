import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { PostService } from './posts.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreatePostDto } from './dtos/create-post.dto';

@ApiTags('Posts')
@UseGuards(JwtAuthGuard)
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
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postService.createPost(createPostDto, req.user.userId);
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
  async updatePost(
    @Param('id') postId: number,
    @Body() updatePostDto: CreatePostDto,
    @Req() req,
  ) {
    return this.postService.updatePost(postId, updatePostDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'ID of the post to delete' })
  @ApiResponse({ status: 200, description: 'Post successfully deleted' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async deletePost(@Param('id') postId: number, @Req() req) {
    return this.postService.deletePost(postId, req.user.userId);
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
  async addComment(
    @Param('id') postId: number,
    @Body() body: CreateCommentDto,
    @Req() req,
  ) {
    return this.postService.addComment(postId, body.content, req.user.userId);
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

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({
    name: 'commentId',
    description: 'ID of the comment to delete',
  })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted' })
  @ApiResponse({ status: 403, description: 'You cannot delete this comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async deleteComment(@Param('commentId') commentId: number, @Req() req) {
    return this.postService.deleteComment(commentId, req.user.userId);
  }
}
