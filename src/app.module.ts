import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config/dist';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { Post } from './post/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'intership_site_blog',
      entities: [Post, User],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PostModule,
    UserModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}