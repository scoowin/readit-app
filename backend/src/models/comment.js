const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: {
        type: String,
    },
    body: {
        type: String,
    },
});

module.exports = mongoose.model('Comment', CommentSchema);
