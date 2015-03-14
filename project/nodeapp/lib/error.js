module.exports = function(res, text, num){
'use strict';

    console.error('error', text);

    res.status(num || 500);

    res.json({error: text});

};