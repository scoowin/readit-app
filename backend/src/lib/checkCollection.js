const mongoose = require('mongoose');
const Collection = mongoose.model('Collection');

function checkCollection(req, res, next) {
    Collection.findOne({ name: req.params.collectionName })
        .then((collection) => {
            if (!collection) {
                res.status(404).json({
                    success: false,
                    msg: 'Collection not found.',
                    err: null,
                });
            } else {
                req.collectionId = collection._id;
                next();
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

module.exports = checkCollection;
