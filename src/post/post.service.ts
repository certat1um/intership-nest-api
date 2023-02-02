import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { DeleteResult, UpdateResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private userService?: UserService,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    return this.postRepository.findOneBy({ id });
  }

  async createOne(createPostDto: CreatePostDto, userData: any): Promise<Post> {
    const user = await this.userService.findOne(userData.email);

    try {
      const post = new Post();

      post.title = createPostDto.title;
      post.text = createPostDto.text;
      post.author = user.id;

      return this.postRepository.save(post);
    } catch (err) {
      return err;
    }
  }

  async updateOne(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new HttpException('Post has not been found', HttpStatus.NOT_FOUND);
    }

    const updatedData = {
      title: updatePostDto.title,
      text: updatePostDto.text,
      updatedAt: new Date(),
    };

    return this.postRepository.update(id, updatedData);
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new HttpException('Post has not been found', HttpStatus.NOT_FOUND);
    }

    return this.postRepository.delete(id);
  }
}
