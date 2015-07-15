+(function(module, require){
'use strict';

var express = require('express');

var controller = function(route){

  this.route = route;

  this.init();
};

controller.prototype = {
  init: function(){
    /*eslint-disable new-cap*/
    this.router = this.router || express.Router(this.route);
    /*eslint-enable new-cap*/

    this.router.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);

      // Pass to next layer of middleware
      next();
    });

    return this.router;
  },
  use: function (main) {

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

})(module, require);
