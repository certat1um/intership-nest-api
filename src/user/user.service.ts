import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: '1',
      username: '1',
      email: '1',
      password: '1',
      token: '1',
    },
    {
      id: '2',
      fullname: '2',
      email: '2',
      password: '2',
      token: '2',
    },
  ];

  async findOne(email: string): Promise<any> {
    return this.users.find((user) => user.email === email);
  }
}
