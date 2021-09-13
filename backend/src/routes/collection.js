const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const authMiddleware = require('../lib/authMiddleware');

//TODO
router.post('/create', (req, res, next) => {});

//TODO
router.get('/show/:collectionId', (req, res, next) => {});

module.exports = router;
