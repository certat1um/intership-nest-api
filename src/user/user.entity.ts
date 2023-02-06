import { IsEmail, IsString, MinLength } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsString()
  @Column()
  accountType: string = 'None';

  @IsString()
  @Column()
  fullname: string;

  @Column({ nullable: true })
  password: string | null = null;
}
