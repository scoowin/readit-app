const router = require('express').Router();

const collectionRoute = require('./collection');
const searchRoute = require('./search');
const userRoute = require('./user');

router.use('/collections', collectionRoute);
router.use('/search', searchRoute);
router.use('/users', userRoute);

module.exports = router;
