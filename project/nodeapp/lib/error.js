'use strict';

module.exports = function(res, text, num) {

    console.error('error', text);

    res.status(num || 500);

    res.json({error: text});

};