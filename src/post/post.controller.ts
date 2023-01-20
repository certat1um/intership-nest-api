import { Controller } from '@nestjs/common';
import {
  Delete,
  Get,
  Param,
  Post as PostReq,
  Put,
  Body,
} from '@nestjs/common/decorators';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('posts')
  async findAll(): Promise<Post[]> {
    const posts = await this.postService.findAll();
    return posts;
  }

  @Get('post/:id')
  async findOne(@Param('id') id: number): Promise<Post> {
    return this.postService.findOneById(id);
  }

  @PostReq('new-post')
  async create(@Body() createPostDto: CreatePostDto): Promise<Post> {
    return this.postService.createOne(createPostDto);
  }

  @Put('update-post/:id')
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return this.postService.updateOne(id, updatePostDto);
  }

  @Delete('delete-post/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.postService.deleteOne(id);
  }
}
