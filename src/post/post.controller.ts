import {
  Controller,
  UseGuards,
  UseInterceptors,
  Res,
  Req,
} from '@nestjs/common';
import {
  Delete,
  Get,
  Param,
  Post as PostReq,
  Put,
  Body,
  UploadedFile,
} from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { logoInterceptor } from './interceptors/logoInterceptor';

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
  @UseInterceptors(logoInterceptor())
  async create(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Post> {
    const logoUrl = `http://${process.env.APP_HOST}:${process.env.APP_PORT}/image/${file.filename}`;

    const postDto: CreatePostDto = {
      ...req.body,
      logoUrl,
    };

    return this.postService.createOne(postDto, req.user.email);
  }

  @Put('update-post/:id')
  async update(
    @Param('id') id: string,
    @Body() postDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return this.postService.updateOne(id, postDto);
  }

  @Delete('delete-post/:id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.postService.deleteOne(id);
  }

  @Get('images/:filename')
  async readImage(
    @Param('filename') filename: string,
    @Res() res,
  ): Promise<void> {
    res.sendFile(filename, { root: './uploads' });
  }
}
