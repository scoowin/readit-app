const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Collection = mongoose.model('Collection');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const authMiddleware = require('../lib/authMiddleware');
const checkCollection = require('../lib/checkCollection');
const checkPost = require('../lib/checkPost');

// ----POST ROUTES ----

//Create new collection
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
                User.findByIdAndUpdate(req.jwt.sub, {
                    $push: { collections: collection._id },
                })
                    .then((user) => {})
                    .catch((err) => {
                        res.status(500).json({
                            success: false,
                            msg: 'Database error',
                            err,
                        });
                    });
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

//Create new post
router.post(
    '/:collectionName/post/new',
    authMiddleware,
    checkCollection,
    async (req, res, next) => {
        if (!(req.body.title && req.body.body)) {
            res.status(400).json({
                success: false,
                msg: 'Invalid request.',
                err: null,
            });
        } else {
            const userId = req.jwt.sub;
            const collectionId = req.collection._id;
            try {
                const collection = await Collection.findById(
                    collectionId
                ).exec();
                if (collection.usersAllowed.indexOf(userId) === -1) {
                    res.status(401).json({
                        success: false,
                        msg: 'Must join collection before posting.',
                        err: null,
                    });
                } else {
                    const user = await User.findById(userId).exec();
                    const author = user.username;
                    const newPost = new Post({
                        title: req.body.title,
                        author,
                        body: req.body.body,
                        comments: [],
                    });
                    const post = await newPost.save();
                    await User.findByIdAndUpdate(userId, {
                        $push: { posts: post._id },
                    }).exec();
                    await Collection.findByIdAndUpdate(collectionId, {
                        $push: { posts: post._id },
                    }).exec();
                    res.status(201).json({
                        success: true,
                        msg: 'Post created successfully.',
                        err: null,
                        post: {
                            id: post._id,
                            title: post.title,
                        },
                    });
                }
            } catch (err) {
                res.status(500).json({
                    success: false,
                    msg: 'Database error.',
                    err,
                });
            }
        }
    }
);

router.post(
    '/:collectionName/post/:postId/comment/new',
    authMiddleware,
    checkCollection,
    checkPost,
    async (req, res, next) => {
        if (!req.body.body) {
            res.status(400).json({
                success: false,
                msg: 'Invalid request.',
                err: null,
            });
        } else {
            try {
                const collection = await Collection.findById(
                    collectionId
                ).exec();
                if (collection.usersAllowed.indexOf(userId) === -1) {
                    res.status(401).json({
                        success: false,
                        msg: 'Must join collection before commenting on posts.',
                        err: null,
                    });
                } else {
                    const user = await User.findById(req.jwt.sub).exec();
                    const author = user.username;
                    const newComment = new Comment({
                        author,
                        body: req.body.body,
                    });
                    const comment = await newComment.save();
                    await Post.findByIdAndUpdate(req.params.postId, {
                        $push: { comments: comment._id },
                    });
                    res.status(201).json({
                        success: true,
                        msg: 'Comment created successfully.',
                        err: null,
                        post: {
                            id: comment._id,
                            author: comment.author,
                        },
                    });
                }
            } catch (err) {
                res.status(500).json({
                    success: false,
                    msg: 'Database error.',
                    err,
                });
            }
        }
    }
);

// ----GET ROUTES----

//Join collection
router.get(
    '/:collectionName/join',
    authMiddleware,
    checkCollection,
    (req, res, next) => {
        const userId = req.jwt.sub;
        const collectionId = req.collection._id;
        let username;
        let collectionName;
        try {
            User.findById(userId).then((user) => {
                if (user.collections.indexOf(collectionId) !== -1) {
                    res.status(200).json({
                        success: true,
                        msg: 'Collection already joined.',
                        err: null,
                    });
                } else {
                    User.findByIdAndUpdate(userId, {
                        $push: { collections: collectionId },
                    }).then((user) => {
                        username = user.username;
                    });
                    Collection.findByIdAndUpdate(collectionId, {
                        $push: { usersAllowed: userId },
                    }).then((collection) => {
                        collectionName = collection.name;
                    });
                    res.status(200).json({
                        success: true,
                        msg: 'Collection joined successfully.',
                        err: null,
                        user: {
                            _id: userId,
                            username,
                        },
                        collection: {
                            _id: collectionId,
                            name: collectionName,
                        },
                    });
                }
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                msg: 'Database error.',
                err,
            });
        }
    }
);

//Show post from collection using postId
router.get(
    '/:collectionName/post/:postId/show',
    checkCollection,
    checkPost,
    (req, res, next) => {
        const { title, author, body, comments } = req.post;
        let commentsArr = [];
        for (let c of comments) {
            Comment.findById(c)
                .then((comment) => {
                    commentsArr.push(comment);
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
            msg: 'Post found',
            err: null,
            post: {
                title,
                author,
                body,
                comments: commentsArr,
            },
        });
    }
);

//Show collection using collectionName
router.get('/:collectionName/show', checkCollection, async (req, res, next) => {
    const { name, desc, posts } = req.collection;
    let postsArr = [];
    try {
        for (let p of posts) {
            let post = await Post.findById(p).exec();
            postsArr.push(post);
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Database error.',
            err,
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
