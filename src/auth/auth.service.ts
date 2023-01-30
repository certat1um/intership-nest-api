import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { config } from 'dotenv';
import { jwtRandom } from './helpers/jwtRandom';
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

  async login(user: User) {
    const payload = { email: user.email };
    //const generatedToken = this.jwtService.sign(payload);
    const generatedToken = jwtRandom();

    console.log(generatedToken);

    return this.userService.refreshUserToken(user.id, generatedToken);
  }

  async register(createUserDto: CreateUserDto): Promise<User | HttpException> {
    const { firstname, lastname, email, password } = createUserDto;

    if (!(firstname && lastname && email && password)) {
      throw new HttpException(
        'All inputs are required',
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
      //user.token = 'this.jwtService.sign({ email })';
      user.token = jwtRandom();

      return this.userService.registerInDB(user);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async loginByGoogle(user: User) {
    if (!user) {
      return 'No user from google';
    }

    return {
      user,
    };
  }
}
