import { Module } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  providers: [PostService, UserService, JwtService],
  controllers: [PostController],
})
export class PostModule {}
