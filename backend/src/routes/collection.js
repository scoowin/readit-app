const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Collection = mongoose.model('Collection');
const Post = mongoose.model('Post');
const authMiddleware = require('../lib/authMiddleware');

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
            admins: [req.jwt.sub],
            usersAllowed: [req.jwt.sub],
            public: true,
            posts: [],
        });
        try {
            newCollection.save().then((collection) => {
                res.status(201).json({
                    success: true,
                    msg: 'Collection created successfully.',
                    err: null,
                    collection: {
                        id: collection._id,
                        name: collection.name,
                    },
                });
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                msg: 'Database error',
                err,
            });
        }
    }
});

//TODO
router.post(
    '/:collectionName/post/:postId/show',
    authMiddleware,
    (req, res, next) => {}
);

//TODO
router.get('/:collectionName/join', authMiddleware, (req, res, next) => {});

//TODO
router.get('/:collectionName/post/:postId', (req, res, next) => {});

router.get('/:collectionName/show', (req, res, next) => {
    Collection.findOne({ name: req.params.collectionName })
        .then((collection) => {
            if (!collection) {
                res.status(404).json({
                    success: false,
                    msg: 'Collection not found.',
                    err: null,
                });
            } else {
                const { name, desc, posts } = collection;
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
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                msg: 'Database error.',
                err,
            });
        });
});

module.exports = router;
