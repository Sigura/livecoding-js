'use strict';

+(function(module, require, error, console){

var baseRequest = require('../baseRequest');

var request = new baseRequest('/api/500');

request.request = function(req, res, next) {
    throw new error('500 for test');
};

module.exports = request;

})(module, require, Error, console)
