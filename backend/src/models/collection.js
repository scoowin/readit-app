const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    desc: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    usersAllowed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
});

module.exports = mongoose.model('Collection', CollectionSchema);
