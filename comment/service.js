const Comment = require('../db/models/comment');
const User = require('../db/models/users');
const Post = require('../db/models/post');
const Logger = require('../logger')

const CommentService = () => {

    const addComment = async (commentData) => {
        try {
            const post = await Post.findByPk(commentData.postId);
            if (post == null) {
                Logger.error(`Post with id ${commentData.postId} not found`);
                throw new Error('Post not found');
            }
            commentData.postId = post.id;
            await Comment.create(commentData);
            return {successful : true}
        } catch (e) {
            Logger.error("Error occurred due to ", e);
            return {successful : false, message : e.message}
        }
    }

    const loadCommentsByPostId = async (postId, pageNo, pageSize = 10) => {
        try {
            pageNo = isNaN(pageNo) ? 0 : pageNo;
            pageSize = (isNaN(pageSize)) ? 10 : pageSize;
            const offset = pageNo * pageSize
            return await Comment.findAll({
                limit : pageSize,
                offset : offset,
                order : [
                    ['id', 'DESC']
                ],
                where : {
                postId : postId
            }});
        } catch (e) {
            Logger.error("Error occurred while loading comments due to ", e);
            return {successful : false, message : e.message}
        }
    }

    return {addComment, loadCommentsByPostId}
}

module.exports = CommentService();