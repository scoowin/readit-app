const router = require('express').Router();
const mongoose = require('mongoose');
const authMiddleware = require('../lib/authMiddleware');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const authUtils = require('../lib/authUtils');
const issueJWT = require('../lib/issueJWT');

//Register user
router.post('/register', (req, res, next) => {
    if (!(req.body.username && req.body.password && req.body.email)) {
        res.status(400).json({
            success: false,
            msg: 'Invalid request.',
            err: null,
        });
    } else {
        const { salt, hash } = authUtils.generatePassword(req.body.password);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            hash,
            salt,
            public: true,
            posts: [],
            collections: [],
        });
        newUser
            .save()
            .then((user) => {
                res.status(201).json({
                    success: true,
                    msg: 'User registered successfully.',
                    err: null,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
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

//Login user
router.post('/login', (req, res, next) => {
    if (!(req.body.username && req.body.password)) {
        res.status(400).json({
            success: false,
            msg: 'Invalid request.',
            err: null,
        });
    } else {
        User.findOne({ username: req.body.username })
            .then((user) => {
                if (!user) {
                    res.status(401).json({
                        success: false,
                        msg: 'User does not exist.',
                        err: null,
                    });
                } else {
                    const isValidated = authUtils.validatePassword(
                        req.body.password,
                        user.hash,
                        user.salt
                    );
                    if (isValidated) {
                        const { token, expiresIn } = issueJWT(user._id);
                        res.status(200).json({
                            success: true,
                            msg: 'User successfully logged in.',
                            err: null,
                            token,
                            expiresIn,
                        });
                    } else {
                        res.status(401).json({
                            success: false,
                            msg: 'Username or password incorrect.',
                            err: null,
                        });
                    }
                }
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    msg: 'Database error.',
                    err,
                });
            });
    }
});

//Get user Profile
router.get('/profiles/:userName', (req, res, next) => {
    User.findOne({ username: req.params.userName })
        .then(async (user) => {
            if (!user) {
                res.status(404).json({
                    success: false,
                    msg: 'User does not exist.',
                    err: null,
                });
            } else {
                const { username, email, public, posts } = user;
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
                if (public) {
                    res.status(200).json({
                        success: true,
                        msg: 'User found.',
                        err: null,
                        user: {
                            username,
                            email,
                            public,
                            posts: postsArr,
                        },
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        msg: 'User found.',
                        err: null,
                        user: {
                            username,
                            public,
                        },
                    });
                }
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

//Get user posts
router.get('/myPosts', authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findById(req.jwt.sub).exec();
        const posts = user.posts;
        let postsArr = [];
        for (let p of posts) {
            let post = await Post.findById(p).exec();
            postsArr.push(post);
        }
        res.status(200).json({
            success: true,
            msg: 'Query successful.',
            err: null,
            posts: postsArr,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Database error',
            err,
        });
    }
});

//Get recent posts across entire website
router.get('/recents', authMiddleware, async (req, res, next) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .exec();
        res.status(200).json({
            success: true,
            msg: 'Query successful',
            err: null,
            posts,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            msg: 'Database error',
            err,
        });
    }
});

module.exports = router;
