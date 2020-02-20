const PostService = require('../post/service');
const { check, validationResult } = require('express-validator');
const passport = require('../middleware/index').passport;
const Logger = require('../logger');
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

const PostController = (app) => {
    app.post("/post", passport.authenticate('bearer', { session: false }),
        [
            check('content').isLength({ min: 3 }).withMessage("Post content length cannot be less tha 3")
        ], async (req, res) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            try {
                req.body.userId = req.user.id
                const result = await PostService.addPost(req.body);
                return res.json(result);
            } catch (e) {
                return res.json({ message: e.message }).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
            }

        });


    app.get("/posts", passport.authenticate('bearer', { session: false }), async (req, res) => {
      try {
            const posts = await PostService.loadPosts(req.query['pageNo'], req.query['pageSize']);
            return  res.json(posts);
      } catch (e) {
          Logger.error("Error occurred while loading posts due to ", e);
            return  res.json({message:'Error occurred while fetching posts'}).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
      }
    });

    app.get("/posts-with-lesser-id", passport.authenticate('bearer', { session: false }), async (req, res) => {
        try {
              const posts = await PostService.loadPostsOfLesserId(req.query['id'], req.query['pageSize']);
              return  res.json(posts);
        } catch (e) {
            Logger.error("Error occurred while loading posts due to ", e);
              return  res.json({message:'Error occurred while fetching posts'}).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
        }
      });

}

module.exports = PostController;