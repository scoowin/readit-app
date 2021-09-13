const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const authMiddleware = require('../lib/authMiddleware');

//TODO
router.post('/register', (req, res, next) => {});

//TODO
router.post('/login', (req, res, next) => {});

router.get('/profiles/:userId', (req, res, next) => {
    User.findById(req.params.userId)
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    msg: 'User does not exist.',
                    err: 'None',
                });
            } else {
                const { username, posts } = user;
                res.status(200).json({
                    username,
                    posts,
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                msg: 'Database error.',
                err,
            });
        });
});

module.exports = router;
