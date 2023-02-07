import { IsEmail, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
