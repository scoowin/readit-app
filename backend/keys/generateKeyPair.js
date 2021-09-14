const crypto = require('crypto');
const fs = require('fs');

function generateKeyPair() {
    const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
    });
    fs.writeFileSync(__dirname + '/public_key.pem', keys.publicKey);
    fs.writeFileSync(__dirname + '/private_key.pem', keys.privateKey);
}

generateKeyPair();
