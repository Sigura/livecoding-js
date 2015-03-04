'use strict';

+(function(require, process, baseDir, console, undefined){

var Application = function(){
    this.init();
};
// 
Application.prototype = {
    port: process.env.port || 3000,
    init: function(){
        this.require();
        this.vars();
        this.initExpress();
        this.sets();
        this.usages();
        this.initRoutes();
        this.start();
    },
    vars: function(){
        this.isDebug = process.env.NODE_ENV === 'gulp-development';
        this.distFolder = (this.isDebug ? 'webapp' : 'dist');
        this.staticDir = this.path.join(baseDir, '..', this.distFolder);
        this.bowerComponentsDir = this.path.join(baseDir, '..', 'bower_components');

        //console.log('static dir: ', this.staticDir);
    },
    require: function(){
        this.express = require('express');
        this.compression = require('compression');
        this.cookieSession = require('cookie-session');
        this.bodyParser = require('body-parser');
        this.serveStatic = require('serve-static')
        this.logger = require('morgan');
        this.favicon = require('serve-favicon');
        this.cookieParser = require('cookie-parser');
        this.path = require('path');
        this.routes = require('./routes');
        //this.expressValidator = require('express-validator');
    },
    initExpress: function(){
        this.app = this.express();
        
    },
    sets: function(){        
        this.app.set('views', this.path.join(baseDir, 'views'));
        this.app.set('view engine', 'jade');
    },
    usages: function(){
        
        var me = this;
        
        this.app.use(this.favicon(this.staticDir + '/favicon.ico'));
        this.app.use(this.logger(this.isDebug ? 'dev' : 'short'));
        this.app.use(this.cookieParser());

        this.app.use(this.compression({filter: function shouldCompress(req, res) {
          if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false;
          }

          // fallback to standard filter function
          return me.compression.filter(req, res)
        }}));

        this.app.use(this.bodyParser.json());
        this.app.use(this.bodyParser.urlencoded({ extended: true }));
        //this.app.use(this.expressValidator); 
        this.app.use(this.cookieSession({ keys: ['8D62B6C1-56BF-472F-840D-5D61CF16928C', 'F0582C8F-D3F1-48C1-8628-1C707525476A'] }));
    },
    initRoutes: function(){
        this.app.use('/', this.express.static(this.staticDir, {
          dotfiles: 'ignore',
          extensions: ['html', 'htm'],
          etag: true,
          index: ['index.html', 'index.htm'],
          lastModified: true,
          //maxAge: '1d',
          redirect: true//,
          // setHeaders: function (res, path, stat) {
            // res.set('x-timestamp', Date.now())
          // }
        }));
        this.app.use('/bower_components', this.express.static(this.bowerComponentsDir, {
          dotfiles: 'ignore',
          extensions: [],
          etag: true,
          index: [],
          lastModified: true,
          //maxAge: '1d',
          redirect: false//,
          // setHeaders: function (res, path, stat) {
            // res.set('x-timestamp', Date.now())
          // }
        }));
        this.routes.register(this);

    },
    start: function(){
        var me = this;
        this.server = this.app.listen(this.port, function () {

            var address = me.server.address();
            var host = address.address;
            var port = address.port;

            console.log('app listening at http://%s:%s', host, port);

        });
    }
};

new Application();
    
})(require, process, __dirname, console, undefined);