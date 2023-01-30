import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { jwtRandom } from '../helpers/jwtRandom';
config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<User> {
    const { displayName, emails } = profile;
    const user = new User();

    user.email = emails[0].value;
    user.fullname = displayName;
    user.accountType = 'Google';
    user.token = jwtRandom();

    const existingUser = await this.userService.findOne(user.email);

    if (!existingUser) {
      this.userService.registerInDB(user);
    }
    return user;
  }
}
