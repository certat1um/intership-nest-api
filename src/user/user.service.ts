import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async refreshUserToken(id: string, token: string) {
    return this.userRepository.update(id, { token });
  }

  async registerInDB(user: User) {
    return this.userRepository.save(user);
  }
}
