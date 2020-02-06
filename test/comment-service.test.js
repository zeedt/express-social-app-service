const User = require('../db/models/users');
const Comment = require('../db/models/comment');
const Post = require('../db/models/post');
const CommentService = require('../comment/service');

jest.mock('../db/models/comment.js');
describe('Comment Service and model tests', () => {

    const mockedComments = [
        {
            content: 'my first comment',
            userId: 1,
            postId: 1
        },
        {
            content: 'my second comment',
            userId: 2,
            postId: 1
        }
    ];

    beforeEach(() => {
        Comment.create.mockResolvedValue(mockedComments[0]);
        Comment.findAll.mockResolvedValue(mockedComments);
    })


    test('should add comment to post via model', async () => {

        const savedComment = await Comment.create(mockedComments[0]);
        expect(savedComment).not.toBe(null);
        expect(savedComment).not.toBe(undefined);
    });


    test('should load comments of post via service', async () => {
        const comments = await CommentService.loadCommentsByPostId({ postId: 1 });
        expect(comments.length).not.toBe(null);
        expect(comments.length).not.toBe(undefined);
    });



});
