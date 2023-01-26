import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt/dist';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOne(email: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ email });
  }

  async register(createUserDto: CreateUserDto): Promise<User | HttpException> {
    const { firstname, lastname, email, password } = createUserDto;

    if (!(firstname && lastname && email && password)) {
      throw new HttpException(
        "All inputs are required",
        HttpStatus.BAD_REQUEST,
      );
    }

    const oldUser = await this.userRepository.findBy({ email: email });

    if(oldUser.length) {
      throw new HttpException(
        "User already exists. Please login",
        HttpStatus.CONFLICT,
      );
    }

    try {
      const user = new User();

      user.fullname = `${firstname} ${lastname}`;
      user.email = email;
      user.password = password;
      user.token = this.jwtService.sign({ email });

      return this.userRepository.save(user);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async refreshUserToken(id: string, token: string) {
    return this.userRepository.update(id, { token });
  }
}
