const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    body: {
        type: String,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    createdAt: {
        type: Date,
    },
});

module.exports = mongoose.model('Post', PostSchema);
