const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const publicKeyPath = path.join(__dirname, '../../keys', 'public_key.pem');
const PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

function authMiddleware(req, res, next) {
    const tokenParts = req.headers.authorization.split(' ');
    if (
        tokenParts[0] === 'Bearer' &&
        tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
        try {
            const verification = jwt.verify(tokenParts[1], PUBLIC_KEY, {
                algorithms: ['RS256'],
            });
            if (
                verification &&
                verification.sub &&
                verification.iat &&
                verification.exp
            ) {
                if (verification.iat >= verification.exp) {
                    res.status(401).json({
                        success: false,
                        msg: 'JWT expired.',
                        err: null,
                    });
                } else {
                    req.jwt = verification;
                    next();
                }
            } else {
                res.status(401).json({
                    success: false,
                    msg: 'JWT invalid.',
                    err: null,
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                msg: 'Error verifying JWT.',
                err,
            });
        }
    }
}

module.exports = authMiddleware;
