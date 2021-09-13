const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    hash: {
        type: String,
    },
    salt: {
        type: String,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    collections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collection',
        },
    ],
});

module.exports = mongoose.model('User', UserSchema);
