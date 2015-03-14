+(function(module, require){
'use strict';

var express = require('express');

var controller = function(route){

    this.route = route;

    this.init();
};

controller.prototype = {
    init: function(){
        this.router = this.router || express.Router(this.route);
        
        return this.router;
    },
    use: function(main){

        this.register(main);
        
        return this.router;
    },
    register: function(main){

        this.route && this.request && this.router.get(this.route, this.request.bind({
            router: this.router,
            main: main
            
        }));
        
        return this.router;
    }
};

module.exports = controller;

})(module, require)
