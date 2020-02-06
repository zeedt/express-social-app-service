const Post = require('../db/models/post');
const PostService = require('../post/service');

jest.mock('../db/models/post.js')

describe('Post model and service tests', () => {

    const mockedPosts = [
        {
            content: 'This is my first post',
            userId: 1,
        },
        {
            content: 'This is my second post',
            userId: 2,
        }
    ]

    beforeEach(() => {
        Post.create.mockResolvedValue(mockedPosts[0]);
        Post.findByPk.mockResolvedValue(mockedPosts[1]);
        Post.findAll.mockResolvedValue(mockedPosts);
    })

    test('should create post from model successfully', async () => {
        const createdPost = await Post.create({ content: 'This is my first post', userId: 1 });
        expect(createdPost).not.toBe(null);
        expect(createdPost).not.toBe(undefined);
        expect(createdPost.userId).toBe(mockedPosts[0].userId);
        expect(createdPost.content).toBe(mockedPosts[0].content);
    });


    test('should find post by pk', async () => {
        const post = await Post.findByPk(1);
        expect(post).not.toBe(null);
        expect(post).not.toBe(undefined);
        expect(post.content).not.toBe(undefined);
        expect(post.content).not.toBe(null);
    });

    test('should create post successfully from post service', async () => {
        const response = await PostService.addPost(mockedPosts[0]);
        expect(response).toBeTruthy();
    });

    test('should load post successfully from post service', async () => {
        const posts = await PostService.loadPosts();
        expect(posts).not.toBe(null);
        expect(posts).not.toBe(undefined);
        expect(posts.length).toBe(2);
    });
    



});
