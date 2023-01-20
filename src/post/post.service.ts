import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    try {
      return this.postsRepository.find();
    } catch (err) {
      console.log('Console: ' + err);
    }
  }

  async findOneById(id: number): Promise<Post> {
    return this.postsRepository.findOne({ where: { _id: id } });
  }

  async createOne(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const post = new Post();

      post.title = createPostDto.title;
      post.text = createPostDto.text;
      post.author = 111;
      post.createdAt = new Date();
      post.updatedAt = new Date();

      return this.postsRepository.save(post);
    } catch (err) {
      return err;
    }
  }

  async updateOne(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    const updatedData = {
      title: updatePostDto.title,
      text: updatePostDto.text,
      updatedAt: new Date(),
    };

    return this.postsRepository.update(id, updatedData);
  }

  async deleteOne(id: number): Promise<DeleteResult> {
    return this.postsRepository.delete(id);
  }
}
