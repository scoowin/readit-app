const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    desc: {
        type: String,
    },
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    usersAllowed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    public: {
        type: Boolean,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
});

module.exports = mongoose.model('Collection', CollectionSchema);
