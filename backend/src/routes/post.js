const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('Post');
const authMiddleware = require('../lib/authMiddleware');

//TODO
router.post('/create', (req, res, next) => {});

//TODO
router.get('/show/:postId', (req, res, next) => {});

module.exports = router;
