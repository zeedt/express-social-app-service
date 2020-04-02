const {connection, Sequelize} = require('../');
const User = require('./users.js')

const Post = connection.define('posts', {
    content : {
        type : Sequelize.TEXT,
        allowNull : false,
        validate : {
            len : [10]
        }
    },
    attachments : {
        type : Sequelize.TEXT
    }
})

Post.belongsTo(User, {foreignKey : {allowNull : false}, as : 'user'});

module.exports = Post;