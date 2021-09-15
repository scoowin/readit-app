const mongoose = require('mongoose');
const Post = mongoose.model('Post');

function checkPost(req, res, next) {
    Post.findById(req.params.postId)
        .then((post) => {
            if (!post) {
                res.status(404).json({
                    success: false,
                    msg: 'Post not found.',
                    err: null,
                });
            } else {
                req.post = post;
                next();
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                msg: 'Database error.',
                err,
            });
        });
}

module.exports = checkPost;
