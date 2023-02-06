import { Module } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from 'src/user/user.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostLogo } from './entities/post-logo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, PostLogo])],
  providers: [PostService, UserService, JwtService],
  controllers: [PostController],
})
export class PostModule {}
