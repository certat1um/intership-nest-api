import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { DeleteResult, UpdateResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository?: Repository<Post>,
    private userService?: UserService,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    return this.postsRepository.findOneBy({ id });
  }

  async createOne(createPostDto: CreatePostDto, userData: any): Promise<Post> {
    if (!(createPostDto.title && createPostDto.text)) {
      throw new HttpException(
        "Inputs shouldn't be empty.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.findOne(userData.email);

    try {
      const post = new Post();

      post.title = createPostDto.title;
      post.text = createPostDto.text;
      post.author = user.id;

      return this.postsRepository.save(post);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async updateOne(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    if (!updatePostDto.title || !updatePostDto.text) {
      throw new HttpException(
        "Inputs shouldn't be empty!",
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedData = {
      title: updatePostDto.title,
      text: updatePostDto.text,
      updatedAt: new Date(),
    };

    return this.postsRepository.update(id, updatedData);
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    const post = await this.postsRepository.findOneByOrFail({ id });

    if (!post) {
      throw new HttpException('Post has not been found', HttpStatus.NOT_FOUND);
    }

    return this.postsRepository.delete(id);
  }
}
