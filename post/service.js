const Post = require('../db/models/post');
const User = require('../db/models/users');


const PostService = () => {


    const addPost = async (postData) => {
        try {
            await Post.create(postData);
            return true;
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
                    attributes: ['username', 'first_name', 'last_name']
                }],
                order : [
                    ['id' , "DESC"]
                ]
            });
    }

    return { addPost, loadPosts }
}



module.exports = PostService();