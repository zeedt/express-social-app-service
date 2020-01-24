const { check, validationResult } = require('express-validator');
const UserService = require('./service');
const oauth2 = require('../authentication/oauth2');


const UserController = (app) => {

    app.post('/oauth/token', oauth2.token);

    app.post("/signup", [
        check('username').isLength({ min: 3, max: 20 }).withMessage("Email required and must not be less than 3 characters"),
        check('email').isEmail(),
        check('password').isLength({ min: 6 }),
        check('first_name').isLength({ min: 6 }),
        check('last_name').isLength({ min: 6 }),
        check('gender').isIn(['MALE', 'FEMALE']),
    ], async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            await UserService.signUp(req.body);
            res.json({message:'Successfully profiled user'});
        } catch (e) {
            res.status(500).json({message:e.message});
        }
    });
}

module.exports = UserController