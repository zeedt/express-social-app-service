const { check, validationResult } = require('express-validator');
const passport = require('../middleware/index').passport;
const SocketIOClient =  require('socket.io-client');
console.log(process.env.SOCIAL_APP_SOCKET_URL);
const socket = SocketIOClient(process.env.SOCIAL_APP_SOCKET_URL);
const ChatService = require('./service');


const ChatController = (app) => {

    app.post('/chat/send',passport.authenticate('bearer', { session: false }),
    [
        check('message').isLength({min:1}).withMessage('Chat cannot be blank'),
        check('to').isLength({min:3}).withMessage('Chat username must be upto 3 characters'),
    ], async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const chat = await ChatService.addChat({content:req.body.message, sender : req.user.username, receiver : req.body.to});
        console.log("Chat id is " + chat.id);
        socket.emit('private-message-redirect', {fromUsername:req.user.username, toUsername : req.body.to, message : req.body.message, id : chat.id});
        res.send("Done");
    });

    app.get('/chat/load-with-less-id/:id/:userId',passport.authenticate('bearer', { session: false }) , async (req, res) => {
        console.log(req.params.id + " " + req.user.username + " " + req.params.userId);
        const previousChats = await ChatService.loadPreviousChat(req.params.id, req.user.username, req.params.userId);
        // console.dir(previousChats);
        res.json(previousChats.reverse());
    });

}

module.exports = ChatController;
