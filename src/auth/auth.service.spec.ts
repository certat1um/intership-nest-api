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

  describe('login()', () => {
    it('returns string', async () => {
      const user: User = {
        id: '1',
        accountType: 'None',
        email: 'example@ex.com',
        fullname: 'John Smith',
      };

      const result = await authService.login(user);

      expect(typeof result).toBe('string');
    });
  });

  describe('register()', () => {
    const user: User = {
      id: '1',
      accountType: 'None',
      email: 'example@ex.com',
      fullname: 'John Smith',
      password: '123',
    };
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

    it('throws HttpException with message and statuscode if createUserDto is empty', async () => {
      const emptyDto = {} as CreateUserDto;
      const expectedResult = new HttpException(
        'Required inputs are empty.',
        HttpStatus.BAD_REQUEST,
      );

      const resultFn = async () => await authService.register(emptyDto);

      expect(resultFn).rejects.toThrow(expectedResult);
    });

    it('throws HttpException with message and statuscode if oldUser has been found', async () => {
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
});
