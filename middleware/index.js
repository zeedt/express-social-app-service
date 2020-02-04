const express = require('express');
const bodyParser = require('body-parser');
const passport = require('../authentication/strategy')
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
const {connection, Sequelize} = require('../db');
const Post = require('../db/models/post')
const Comment = require('../db/models/comment');
const Logger = require('../logger');

connection.sync().then(()=>{
    console.log("Database synchronised successfully");
}).catch((error)=> {
    Logger.error("Error occurred due to ", error)
});

module.exports = {app, passport};