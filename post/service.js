const Post = require('../db/models/post');
const User = require('../db/models/users');
const Op = require('../db/index').Sequelize.Op;
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const PostService = () => {

    const uploadMultipleFiles = multer({ storage: storage }).array('files');


    const addPost = async (postData) => {
        try {
            return await Post.create(postData);
        } catch (e) {
            throw new Error(e);
        }

    }

    const loadPosts = async (pageNo = 0, pageSize = 10) => {
        pageNo = isNaN(pageNo) ? 0 : pageNo;
        pageSize = (isNaN(pageSize)) ? 10 : pageSize;
        const offset = pageNo * pageSize
        return await Post.findAll(
            {
                limit : pageSize,
                offset : offset,
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['username', 'first_name', 'last_name', 'display_picture']
                }],
                order : [
                    ['id' , "DESC"]
                ]
            });
    }
    const loadPostsOfLesserId = async (id = 0, pageSize = 10) => {
        pageSize = (isNaN(pageSize)) ? 10 : pageSize;
        return await Post.findAll(
            {
                where : {
                    id : {[Op.lt] : (id)}
                },
                limit : pageSize,
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['username', 'first_name', 'last_name', 'display_picture']
                }],
                order : [
                    ['id' , "DESC"]
                ]
            });
    }

    return { addPost, loadPosts, loadPostsOfLesserId, uploadMultipleFiles }
}



module.exports = PostService();