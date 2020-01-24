const {connection, Sequelize} = require('../');
const User = require('./users.js')

const Post = connection.define('posts', {
    content : {
        type : Sequelize.TEXT,
        allowNull : false,
        validate : {
            len : [10]
        }
    }
})

Post.belongsTo(User, {foreignKey : {allowNull : false}});

module.exports = Post;