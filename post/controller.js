const PostService = require('../post/service');
const { check, validationResult } = require('express-validator');
const passport = require('../middleware/index').passport;

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
                await PostService.addPost(req.body);
                return  res.json({message : "Post added successfully"});
            } catch (e) {
                return  res.json({message : e.message});
            }
            
        });
}

module.exports = PostController;