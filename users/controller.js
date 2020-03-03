const { check, validationResult } = require('express-validator');
const UserService = require('./service');
const oauth2 = require('../authentication/oauth2');
const passport = require('../middleware/index').passport;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;
const multer = require('multer');
const fs = require('fs');
const S3StorageService = require('../s3/s3-storage');
const S3_BUCKET_URL = 'https://social-app-bucket1.s3.amazonaws.com/social-app-images/';
const UserController = (app) => {

    app.post('/oauth/token', oauth2.token);

    app.post("/signup", [
        check('username').isLength({ min: 3, max: 20 }).withMessage("Email required and must not be less than 3 characters"),
        check('email').isEmail(),
        check('password').isLength({ min: 6 }),
        check('first_name').isLength({ min: 3 }),
        check('last_name').isLength({ min: 3 }),
        check('gender').isIn(['MALE', 'FEMALE']),
    ], async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            await UserService.signUp(req.body);
            res.json({ message: 'Successfully profiled user' });
        } catch (e) {
            res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({ message: e.message });
        }
    });

    app.get("/load-users", passport.authenticate('bearer', { session: false }), async (req, res) => {
        const result = await UserService.loadUsers();
        if (result.successful) {
            res.json(result);
        } else {
            res.json(result).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
        }
    });

    app.get("/my-info", passport.authenticate('bearer', { session: false }), async (req, res) => {
        console.log("User id " + req.user.id);
        const response = await UserService.loadUserInformation(req.user.username);
        if (!response.successful) {
            return res.status(500).json(response);
        }
        return res.json(response);
    });

    app.post("/upload-image", passport.authenticate('bearer', { session: false }), async (req, res) => {
        var filePath;

        console.dir("File ");
        console.log(req.file);
        await UserService.uploadImage(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
            console.log(`${req.file.path}/${req.file.filename}`);
            const fileContent = fs.readFileSync(`${req.file.path}`);
            S3StorageService.uploadImageToS3(fileContent, req.file.filename);
            const response = await UserService.saveUserDisplayPicture(req.user.id, `${S3_BUCKET_URL}${req.file.filename}`);
            fs.unlinkSync(`${req.file.path}`);
            if (!response.successful) {
                return res.status(500).json(response)
            }
            return res.status(200).json(response)
        });
    });

    app.get("/load-profile-picture/:id", async (req, res) => {

        const response = await UserService.loadDisplayPictureForUser(req.params.id);

        if (response.successful) {
            return res.json(response);
        }
        return res.json(response).status(500);

    });

    app.get('/logout', passport.authenticate('bearer', { session: false }), async (req, res) => {
        console.log("User id " + req.user.id);
        const response = await UserService.logout(req.user.id);
        res.json({ successful: response });
    });

    app.post("/update-my-info", [
        check('email').isEmail(),
        check('password').isLength({ min: 6 }),
        check('first_name').isLength({ min: 3 }),
        check('last_name').isLength({ min: 3 }),
    ], passport.authenticate('bearer', { session: false }), async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const response = await UserService.updateUserInfo(req.body, req.user.username);
            if (response.successful) {
                res.status(200).json(response);
            }
            res.status(500).json(response);
        } catch (e) {
            console.log("Error occurred due to ", e)
            res.status(500).json({ successful: false, message: 'Error occurred due to ' + e.message });
        }

    });


    app.post("/update-password", [
        check('currentPassword').isLength({ min: 6 }),
        check('newPassword').isLength({ min: 6 })
    ], passport.authenticate('bearer', { session: false }), async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const response = await UserService.updateUserPassword(req.body, req.user.username);
            if (response.successful) {
                res.status(200).json(response);
            }
            res.status(500).json(response);
        } catch (e) {
            console.log("Error occurred due to ", e)
            res.status(500).json({ successful: false, message: 'Error occurred due to ' + e.message });
        }

    });

    app.get("/filter-users/:filter_value", passport.authenticate('bearer', { session: false }), async (req, res) => {
        console.log("Filter value os " + req.params.filter_value)
        const response = await UserService.filterUser(req.params.filter_value);
        return res.json(response);
    });

    app.get("/find-user/:username", passport.authenticate('bearer', { session: false }), async (req, res) => {
        const response = await UserService.findUserByUsername(req.params.username);
        if (response != null && response.username === req.params.username) {
            return res.json(response);
        }
        return res.status(500).json({ message: "User not found" });
    });
}

module.exports = UserController