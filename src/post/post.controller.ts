import { Request, Controller, UseGuards } from '@nestjs/common';
import {
  Delete,
  Get,
  Param,
  Post as PostReq,
  Put,
  Body,
} from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('posts')
  async findAll(): Promise<Post[] | string> {
    return this.postService.findAll();
  }

  @Get('post/:id')
  async findOne(@Param('id') id: string): Promise<Post> {
    return this.postService.findOne(id);
  }

  @PostReq('new-post')
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
  ): Promise<Post | void> {
    return this.postService.createOne(createPostDto, req.user);
  }

  @Put('update-post/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return this.postService.updateOne(id, updatePostDto);
  }

  @Delete('delete-post/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.postService.deleteOne(id);
  }
}
