const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const authUtils = require('../lib/authUtils');
const issueJWT = require('../lib/issueJWT');

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
        try {
            newUser.save().then((user) => {
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

router.get('/profiles/:userName', (req, res, next) => {
    User.findOne({ username: req.params.userName })
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    success: false,
                    msg: 'User does not exist.',
                    err: null,
                });
            } else {
                const { username, email, public, posts } = user;
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

module.exports = router;
