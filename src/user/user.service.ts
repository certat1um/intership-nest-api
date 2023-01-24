import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt/dist';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOne(email: string): Promise<any> {
    return this.userRepository.findOneByOrFail({ email });
  }

  async register(formData: any) {
    const { firstname, lastname, ...otherData } = formData;

    const payload = { email: otherData.email };

    const userData = {
      fullname: `${firstname} ${lastname}`,
      token: this.jwtService.sign(payload),
      ...otherData,
    };

    return this.userRepository.save(userData);
  }

  async refreshUserToken(id: string, token: string) {
    return this.userRepository.update(id, { token });
  }
}
