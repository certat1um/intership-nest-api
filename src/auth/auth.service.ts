import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { config } from 'dotenv';
config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOne(email);

    if (user && user.password === pass && user.accountType === 'None') {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<string> {
    const payload = { email: user.email };
    const generatedToken = this.jwtService.sign(payload);

    return generatedToken;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { firstname, lastname, email, password } = createUserDto;

    if (!(firstname && lastname && email && password)) {
      throw new HttpException(
        'Required inputs are empty.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const oldUser = await this.userService.findOne(email);

    if (oldUser) {
      throw new HttpException(
        'User already exists. Please login',
        HttpStatus.CONFLICT,
      );
    }

    try {
      const user = new User();

      user.fullname = `${firstname} ${lastname}`;
      user.email = email;
      user.password = password;

      return this.userService.registerInDB(user);
    } catch (err) {
      return err;
    }
  }

  async loginByGoogle(user: User) {
    if (!user) {
      return 'No user from google';
    }
    return user
  }
}
