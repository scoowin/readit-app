const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function validatePassword(password, hash, salt) {
    let hash1 = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex');
    return hash1 === hash;
}

function generatePassword(password) {
    let salt = crypto.randomBytes(32).toString('hex');
    let hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
        .toString('hex');
    return {
        salt,
        hash,
    };
}

module.exports = {
    validatePassword,
    generatePassword,
};
