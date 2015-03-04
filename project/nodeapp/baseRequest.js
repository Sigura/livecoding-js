'use strict';

+(function(module, require){

var express = require('express');

var baseRequest = function(route){
    this.route = route;
};

baseRequest.prototype = {
    init: function(){
        this.router = express.Router();        
    },
    use: function(main){

        this.init();

        this.register(main);
        
        return this.router;
    },
    register: function(main){
        this.router.get(this.route, this.request.bind({
            router: this.router,
            main: main
            
        }));
    },
    request: function(req, res, next) {
        throw new error('not implemented');
    },
};

module.exports = baseRequest;

})(module, require)
