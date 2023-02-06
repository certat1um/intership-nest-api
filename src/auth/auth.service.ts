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
      return user.email;
    }
    return null;
  }

  async login(userEmail: string): Promise<string> {
    const payload = { email: userEmail };
    const generatedToken = this.jwtService.sign(payload);

    return generatedToken;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { firstname, lastname, email, password } = createUserDto;

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

  async loginByGoogle(user: User | null): Promise<User> {
    if (user === null) {
      throw new HttpException(
        'Failed authentification via Google',
        HttpStatus.CONFLICT,
      );
    }
    return user;
  }
}
