const { check, validationResult } = require('express-validator');
const passport = require('../middleware/index').passport;
const Logger = require('../logger');
const CommentService = require('./service.js');
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

const CommentController = (app) => {

    app.get('/comment/:postId', passport.authenticate('bearer', { session: false }), async (req, res) => {
        try {
            const comments = await CommentService.loadCommentsByPostId(req.params.postId, req.query['pageNo'], req.query['pageSize']);
            res.json(comments);
        } catch (e) {
             res.json({message:e.message}).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
        }
    });

    app.post('/comment', passport.authenticate('bearer', { session: false }), [
        check('content').isLength({min:3}).withMessage('Comment cannot be less than 3 characters'),
        check('postId').isNumeric().withMessage('Post id cannot be blank')
    ], async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            req.body.userId = req.user.id
            const postCommentResult = await CommentService.addComment(req.body);
            if (postCommentResult.successful) {
                return  res.json(postCommentResult);
            } else {
                return  res.json(postCommentResult).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
            }
        } catch (e) {
            Logger.error('Error occurred while adding comment ', e);
            return res.json({ message: e.message }).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
        }
    });

}


module.exports = CommentController;

