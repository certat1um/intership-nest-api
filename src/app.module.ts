import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config/dist';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { Post } from './post/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { config } from 'dotenv';
import { PostLogo } from './post/entities/post-logo.entity';
config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.USER_NAME,
      password: process.env.USER_PASSWORD || '',
      database: process.env.DB_DATABASE,
      entities: [Post, User, PostLogo],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PostModule,
    UserModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
