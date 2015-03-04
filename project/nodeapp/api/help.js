'use strict';

+(function(module, require){

var baseRequest = require('../baseRequest');

var request = new baseRequest('/api/help');

request.request = function(req, res, next) {
    res.json({ a: 1 });    
};

module.exports = request;

})(module, require)
