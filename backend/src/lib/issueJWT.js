const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const privateKeyPath = path.join(__dirname, '../../keys', 'private_key.pem');
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');

function issueJWT(userId) {
    const _id = userId;
    const expiresIn = 1000 * 60 * 60 * 24 * 14;
    const payload = {
        sub: _id,
        iat: Date.now(),
    };
    const tokenOptions = {
        expiresIn,
        algorithm: 'RS256',
    };
    const signedToken = jwt.sign(payload, PRIVATE_KEY, tokenOptions);
    const token = 'Bearer ' + signedToken;
    return {
        token,
        expiresIn,
    };
}

module.exports = issueJWT;
