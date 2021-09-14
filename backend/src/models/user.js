const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    hash: {
        type: String,
    },
    salt: {
        type: String,
    },
    public: {
        type: Boolean,
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
