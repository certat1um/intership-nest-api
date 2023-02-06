import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('AuthService', () => {
  let userService: UserService;
  let authService: AuthService;
  let userRepository: Repository<User>;

  const USER_REP_TOKEN = getRepositoryToken(User);
  const JWT_TEST_TOKEN = 'jwt.secret.token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => JWT_TEST_TOKEN),
          },
        },
        {
          provide: USER_REP_TOKEN,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(USER_REP_TOKEN);
  });

  it('all dependencies should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(authService).toBeDefined();
  });

  const user = {
    id: '1',
    accountType: 'None',
    email: 'example@ex.com',
    fullname: 'John Smith',
    password: '123',
  };

  describe('login()', () => {
    it('returns string if success', async () => {
      const result = await authService.login(user.email);

      expect(typeof result).toBe('string');
    });
  });

  describe('register()', () => {
    const createUserDto: CreateUserDto = {
      firstname: 'John',
      lastname: 'Smith',
      email: 'example@ex.com',
      password: '123456',
    };

    it('returns User Entity if success', async () => {
      jest
        .spyOn(userService, 'findOne')
        .mockImplementationOnce(async () => null);
      jest
        .spyOn(userService, 'registerInDB')
        .mockImplementationOnce(async () => user);

      const result = await authService.register(createUserDto);

      expect(result).toEqual(user);
    });

    it('throws HttpException with message and statuscode if user is already exist', async () => {
      const expectedResult = new HttpException(
        'User already exists. Please login',
        HttpStatus.CONFLICT,
      );

      jest
        .spyOn(userService, 'findOne')
        .mockImplementationOnce(async () => user);

      const resultFn = async () => await authService.register(createUserDto);

      expect(resultFn).rejects.toThrow(expectedResult);
    });
  });

  describe('loginByGoogle()', () => {
    it('returns a user if success', async () => {
      const result = await authService.loginByGoogle(user);

      expect(result).toEqual(user);
    });

    it('throws HttpException with message and statuscode if user is null', async () => {
      const expectedResult = new HttpException(
        'Failed authentification via Google',
        HttpStatus.CONFLICT,
      );

      const resultFn = async () => await authService.loginByGoogle(null);

      expect(resultFn).rejects.toThrow(expectedResult);
    });
  });
});
