module.exports = function(x) {
    let crypto = require('crypto');
    let salt = '924BDF99-E383-41D6-A56E-1283BF62EEA9';
    let hash = crypto.createHash('sha1')
        .update(salt + x)
        .digest('base64');

    return hash;
};