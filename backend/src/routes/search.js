const router = require('express').Router();
const mongoose = require('mongoose');
const authMiddleware = require('../lib/authMiddleware');
const User = mongoose.model('User');
const Collection = mongoose.model('Collection');
const Post = mongoose.model('Post');

router.get('/:searchQuery', authMiddleware, async (req, res, next) => {
    try {
        searchQuery = req.params.searchQuery;
        const users = await User.find({
            username: { $regex: searchQuery, $options: 'i' },
        })
            .limit(4)
            .exec();
        const posts = await Post.find({
            title: { $regex: searchQuery, $options: 'i' },
        })
            .limit(4)
            .exec();
        const collections = await Collection.find({
            name: { $regex: searchQuery, $options: 'i' },
        })
            .limit(4)
            .exec();
        res.status(200).json({
            success: true,
            msg: 'Search successful',
            err: null,
            users,
            posts,
            collections,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Database error',
            err,
        });
    }
});

module.exports = router;
