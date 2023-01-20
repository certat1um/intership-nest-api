import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  email: string;

  @Column()
  fullname: string;

  @Column()
  password: string;

  @Column()
  token: string;
}
