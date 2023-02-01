import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountType: string = 'None';

  @Column({ unique: true })
  email: string;

  @Column()
  fullname: string;

  @Column({ nullable: true })
  password?: string;
}
