'use strict';

+(function(module, require/*, Error*/) {

var path = require('path');

module.exports = {
  routeTable: [
    //{path: './api/users'},
    //{path: './api/expenses'}
  ],
  register: function(main){

    this.registerRoutes(main);

    this.registerErrors(main);
  },
  registerRoutes: function(main){

    this.routeTable.forEach(function(item){
      var page = require(item.path);

      main.express.use(page.use(main));
    });

  },
  registerErrors: function(main){

    main.express.use('/expenses/*', function(req, res/*, next*/) {
      var index = path.join(__dirname, '..', !main.isDebug ? 'dist' : 'webapp', 'index.html');

      res.sendFile(index);
    });

    main.express.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;

      next(err);
    });

    main.express.use(function(err, req, res, next) {
      var status = err.status || err.statusCode || 500;
      if (req.xhr) {
        res.status(status).send({
          status: status,
          message: err.message,
          error: main.isDebug && err
        });
      } else {
        next(err);
      }
    });
    // main.express.use(function(err, req, res, next) {
      // res.status(err.status || 500);

      // res.render('error', {
        // title: 'Error 500',
        // message: err.message,
        // error: {}
      // });
    // });

  }
};

})(module, require, Error);
