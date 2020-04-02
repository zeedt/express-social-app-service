const PostService = require('../post/service');
const { check, validationResult } = require('express-validator');
const passport = require('../middleware/index').passport;
const Logger = require('../logger');
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;
const multer = require('multer');
const fs = require('fs');
const S3StorageService = require('../s3/s3-storage');
const S3_BUCKET_URL = 'https://social-app-bucket1.s3.amazonaws.com/social-app-images/';
const formidableMiddleware = require('express-formidable');
let path = require('path');

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


    app.post("/post-with-attachment", formidableMiddleware({
        encoding: 'utf-8',
        uploadDir: 'uploads',
        keepExtensions: true,
        multiples: true, // req.files to be arrays of files
    }), passport.authenticate('bearer', { session: false }), async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        console.log("BODY " + JSON.stringify(req.fields));
        try {
            const files = req.files.files.length > 0 ? req.files.files : [req.files.files];
            let filePaths = [];
            for (var i = 0; i < files.length; i++) {
                if (files[i].size > 0) {
                    console.log("IN");
                    try {
                        console.log(`${files[i].path}/${files[i].filename}`);
                        const fileContent = fs.readFileSync(`${files[i].path}`);
                        const fileName = new Date().getTime() + "_" + files[i].name;
                        await S3StorageService.uploadImageToS3(fileContent, fileName);
                        filePaths.push(S3_BUCKET_URL + fileName);
                        // const response = await UserService.saveUserDisplayPicture(req.user.id, `${S3_BUCKET_URL}${req.file.filename}`);
                        fs.unlinkSync(`${files[i].path}`);
                    } catch (err) {
                        console.log("Error occurred during file upload due to " + err);
                        for (var j = i; j < files.length; j++) {
                            fs.unlinkSync(`${files[j].path}`);
    
                        }
                        return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({ message: e.message });
                    }
                }
            }
            console.log(filePaths.length);
            const result = await PostService.addPost({
                content: req.fields.content,
                attachments: JSON.stringify(filePaths),
                userId: req.user.id
            });
            return res.json(result);
        } catch (e) {
            console.error(e);
            return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({ message: e.message });
        }

    });


    app.get("/posts", passport.authenticate('bearer', { session: false }), async (req, res) => {
        try {
            const posts = await PostService.loadPosts(req.query['pageNo'], req.query['pageSize']);
            return res.json(posts);
        } catch (e) {
            Logger.error("Error occurred while loading posts due to ", e);
            return res.json({ message: 'Error occurred while fetching posts' }).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
        }
    });

    app.get("/posts-with-lesser-id", passport.authenticate('bearer', { session: false }), async (req, res) => {
        try {
            const posts = await PostService.loadPostsOfLesserId(req.query['id'], req.query['pageSize']);
            return res.json(posts);
        } catch (e) {
            Logger.error("Error occurred while loading posts due to ", e);
            return res.json({ message: 'Error occurred while fetching posts' }).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
        }
    });

}

module.exports = PostController;