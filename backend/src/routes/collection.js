const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Collection = mongoose.model('Collection');
const Post = mongoose.model('Post');
const authMiddleware = require('../lib/authMiddleware');
const checkCollection = require('../lib/checkCollection');

router.post('/new', authMiddleware, (req, res, next) => {
    if (!(req.body.name && req.body.desc)) {
        res.status(400).json({
            success: false,
            msg: 'Invalid request.',
            err: null,
        });
    } else {
        const newCollection = new Collection({
            name: req.body.name,
            desc: req.body.desc,
            owner: req.jwt.sub,
            usersAllowed: [req.jwt.sub],
            posts: [],
        });
        newCollection
            .save()
            .then((collection) => {
                res.status(201).json({
                    success: true,
                    msg: 'Collection created successfully.',
                    err: null,
                    collection: {
                        id: collection._id,
                        name: collection.name,
                    },
                });
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    msg: 'Database error',
                    err,
                });
            });
    }
});

//TODO
router.post(
    '/:collectionName/post/:postId/new',
    authMiddleware,
    checkCollection,
    (req, res, next) => {}
);

router.get(
    '/:collectionName/join',
    authMiddleware,
    checkCollection,
    (req, res, next) => {
        const userId = req.jwt.sub;
        const collectionId = req.collectionId;
        const username;
        const collectionName;
        User.findByIdAndUpdate(userId, {
            $push: { collections: collectionId },
        })
            .then((user) => {
                username = user.username;
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    msg: 'Database error.',
                    err,
                });
            });
        Collection.findByIdAndUpdate(collectionId, {
            $push: { usersAllowed: userId },
        })
            .then((collection) => {
                collectionName = collection.name;
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    msg: 'Database error.',
                    err,
                });
            });
        res.status(200).json({
            success: true,
            msg: 'Collection joined successfully.',
            err: null,
            user: {
                _id: userId,
                username
            },
            collection: {
                _id: collectionId,
                name: collectionName,
            },
        });
    }
);

//TODO
router.get(
    '/:collectionName/post/:postId/show',
    checkCollection,
    (req, res, next) => {}
);

router.get('/:collectionName/show', checkCollection, (req, res, next) => {
    const { name, desc, posts } = req.collection;
    let postsArr = [];
    for (p of posts) {
        Post.findById(p)
            .then((post) => {
                postsArr.push(post);
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    msg: 'Database error.',
                    err,
                });
            });
    }
    res.status(200).json({
        success: true,
        msg: 'Collection found.',
        err: null,
        collection: {
            name,
            desc,
            posts: postsArr,
        },
    });
});

module.exports = router;
