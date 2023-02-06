import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { PostLogo } from './post-logo.entity';

@Entity('posts')
export class Post {
  @IsString()
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  text: string;

  @IsNotEmpty()
  @OneToOne(() => PostLogo, (post) => post.id)
  @JoinColumn()
  logo: string;

  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.id)
  author: string;

  @IsDate()
  @IsNotEmpty()
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @UpdateDateColumn()
  updatedAt: Date;
}
