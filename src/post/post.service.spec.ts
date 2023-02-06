import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { Repository, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostLogo } from './entities/post-logo.entity';

describe('PostService', () => {
  let postService: PostService;
  let userService: UserService;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;
  let PostLogoRepository: Repository<PostLogo>;

  const POST_REP_TOKEN = getRepositoryToken(Post);
  const USER_REP_TOKEN = getRepositoryToken(User);
  const POST_LOGO_REP_TOKEN = getRepositoryToken(PostLogo);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        UserService,
        {
          provide: POST_REP_TOKEN,
          useValue: {
            save: jest.fn(),
            update: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: USER_REP_TOKEN,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: POST_LOGO_REP_TOKEN,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    userService = module.get<UserService>(UserService);
    postRepository = module.get<Repository<Post>>(POST_REP_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REP_TOKEN);
    PostLogoRepository = module.get<Repository<PostLogo>>(POST_LOGO_REP_TOKEN);
  });

  it('all dependencies should be defined', () => {
    expect(postService).toBeDefined();
    expect(postRepository).toBeDefined();
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createOne()', () => {
    const createPostDto = {
      title: 'title',
      text: 'text',
      logoUrl: 'http://localhost:3333/images/example.png',
    };
    const userData = {
      email: 'example@ex.com',
    };

    it('returns Post entity if success', async () => {
      const foundUser = {
        id: '1',
      };
      const expectedResponse: Post = {
        id: '1',
        title: createPostDto.title,
        text: createPostDto.text,
        logo: createPostDto.logoUrl,
        author: foundUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(postRepository, 'save')
        .mockImplementationOnce(async () => expectedResponse);
      jest
        .spyOn(PostLogoRepository, 'save')
        .mockImplementationOnce(async () => {
          return {
            id: '1',
            url: createPostDto.logoUrl,
          } as PostLogo;
        });
      jest.spyOn(userService, 'findOne').mockImplementationOnce(async () => {
        return foundUser as User;
      });

      const result = await postService.createOne(createPostDto, userData.email);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('updateOne()', () => {
    const postIdToUpdate = '1';
    const emptyDto = {} as UpdatePostDto;
    const updatePostDto = {
      title: 'title',
      text: 'text',
    };

    it('returns UpdateResult if success', async () => {
      const expectedResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };
      const emptyPost = {} as Post;

      jest
        .spyOn(postRepository, 'update')
        .mockImplementationOnce(async () => expectedResult);
      jest
        .spyOn(postRepository, 'findOneBy')
        .mockImplementationOnce(async () => emptyPost);

      const result = await postService.updateOne(postIdToUpdate, updatePostDto);

      expect(result).toEqual(expectedResult);
    });

    it('throws HttpException with message and statuscode if post is not exist', async () => {
      const expectedResult = new HttpException(
        'Post has not been found',
        HttpStatus.NOT_FOUND,
      );
      const post = undefined;

      jest
        .spyOn(postRepository, 'findOneBy')
        .mockImplementationOnce(async () => post);

      const resultFn = async () =>
        await postService.updateOne(postIdToUpdate, updatePostDto);

      expect(resultFn).rejects.toThrow(expectedResult);
    });
  });

  describe('deleteOne()', () => {
    const postIdToDelete = '1';

    it('returns DeleteResult if success', async () => {
      const expectedResult: UpdateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };
      const emptyPost = {} as Post;

      jest
        .spyOn(postRepository, 'findOneBy')
        .mockImplementationOnce(async () => emptyPost);
      jest
        .spyOn(postRepository, 'delete')
        .mockImplementationOnce(async () => expectedResult);

      const result = await postService.deleteOne(postIdToDelete);

      expect(result).toEqual(expectedResult);
    });

    it('throws HttpException with message and statuscode if post is absent', async () => {
      const expectedResult = new HttpException(
        'Post has not been found',
        HttpStatus.NOT_FOUND,
      );
      const post = undefined;

      jest
        .spyOn(postRepository, 'findOneBy')
        .mockImplementationOnce(async () => post);

      const resultFn = async () => await postService.deleteOne(postIdToDelete);

      expect(resultFn).rejects.toThrow(expectedResult);
    });
  });
});
