//import { PostController } from "./post.controller";
//import { Post } from "./post.entity";
//import { CreatePostDto } from "./dto/create-post.dto";
//import { PostService } from "./post.service";

//describe('Post service functions test:', () => {
//  let postService: PostService;
//  let postController: PostController;
//  let createPostDto: CreatePostDto

//  beforeEach(() => {
//    postService = new PostService();
//    postController = new PostController(postService);
//  });

//  describe('createOne()', () => {
//    it('createOne() returns an exception in cause of empty inputs', async () => {
//      const user = {
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
//      jest.spyOn(postService, 'createOne').mockImplementation(() => expected);

//      expect(await postService.createOne(createPostDto, user)).toBe(expected);
//    });
//  })
//});
