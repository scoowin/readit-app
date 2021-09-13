const router = require('express').Router();

const collectionRoute = require('./collection');
const postRoute = require('./post');
const userRoute = require('./user');

router.use('/collections', collectionRoute);
router.use('/posts', postRoute);
router.use('/users', userRoute);

module.exports = router;
