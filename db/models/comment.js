
const {connection, Sequelize} = require('../');
const User = require('./users');
const Post = require('./post');

const Comment = connection.define('comment', {
    content : {
        type : Sequelize.TEXT,
        allowNull : false,
        validate : {
            len : [3]
        }
    }
});

Comment.belongsTo(User, {foreignKey:{allowNull:false}, as : 'user'});
Comment.belongsTo(Post, {foreignKey:{allowNull:false}, as : 'post'});

module.exports = Comment;