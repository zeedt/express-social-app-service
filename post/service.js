const Post = require('../db/models/post');


const PostService = () => {


    const addPost =  async (postData) => {
        try {
            await Post.create(postData);
            return true;
        } catch (e) {
            throw new Error(e);
        }

    }

    return {addPost}
}

module.exports = PostService();