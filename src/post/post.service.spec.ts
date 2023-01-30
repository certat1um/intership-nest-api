//import { CreatePostDto } from "./dto/create-post.dto";
//import { PostService } from "./post.service";
//import { Test } from "@nestjs/testing";
//import { Post } from "./post.entity";
//import { TypeOrmModule } from "@nestjs/typeorm";
//import { UserService } from "../user/user.service";
//import { User } from "../user/user.entity";
//import { DataSource } from "typeorm";

//describe('Post service functions test:', () => {
//  let postService: PostService;
//  let createPostDto: CreatePostDto;

//  beforeEach(async () => {
//    const module = await Test.createTestingModule({
//      imports: [TypeOrmModule.forFeature([Post, User]), DataSource],
//      providers: [UserService, PostService],
//    }).compile();

//    postService = module.get<PostService>(PostService);
//  });

//  describe('createOne()', () => {
//    it('returns a correct response', async () => {
//      const user = {
//        id: '123',
//        email: 'example@ex.com'
//      }
//      const expected = {
//        "title": "new title",
//        "text": "new text",
//        "author": "testAuthorId",
//        "id": "d4057377-78a4-4d3c-9321-64518fe03234",
//        "createdAt": new Date(),
//        "updatedAt": new Date()
//      };
//      //jest.spyOn(postService, 'createOne').mockImplementation(async () => expected);
//      //const response = await postService.createOne(createPostDto, user)

//      //expect(response).toBe(expected);
//      expect(postService).toBeDefined();
//      expect(createPostDto).toBeDefined();
//    });
//  });
//});
