import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { DeleteResult, UpdateResult, Repository, DataSource } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { CreatePostLogoDto } from './dto/create-post-logo.dto';
import { PostLogo } from './entities/post-logo.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostLogo)
    private postLogoRepository: Repository<PostLogo>,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    return this.postRepository.findOneBy({ id });
  }

  async createOne(postDto: CreatePostDto, userEmail: string): Promise<Post> {
    const user = await this.userService.findOne(userEmail);

    try {
      const postLogo = new PostLogo();
      postLogo.url = postDto.logoUrl;

      const post = new Post();
      post.title = postDto.title;
      post.text = postDto.text;
      post.author = user.id;

      const { id } = await this.postLogoRepository.save(postLogo);
      post.logo = id;

      return this.postRepository.save(post);
    } catch (err) {
      return err;
    }
  }

  async updateOne(id: string, postDto: UpdatePostDto): Promise<UpdateResult> {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new HttpException('Post has not been found', HttpStatus.NOT_FOUND);
    }

    const updatedData = {
      title: postDto.title,
      text: postDto.text,
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
