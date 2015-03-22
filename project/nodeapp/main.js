+(function(module, require, process, baseDir, console, undefined){
'use strict';

var Application = function(port){
    
    this.port = port || 3000;
    
    this.init();
    
    console.log('app ctor ended');
};
// 
Application.prototype = {
    init: function(){
        this.require();
        this.vars();
        this.initExpress();
        this.sets();
        this.usages();
        this.initRoutes();
        //this.start();
    },
    vars: function(){
        this.isDebug = process.env.serve === 'gulp';

        this.distrDir = this.path.join(baseDir, '..', 'dist');
        this.staticDir = this.path.join(baseDir, '..', 'webapp');
        this.tmpDir = this.path.join(baseDir, '..', '.tmp');

        this.isDebug && console.log('static dir: ', this.staticDir);
        this.isDebug && console.log('render dir: ', this.distrDir);
    },
    require: function(){
        this.Express = require('express');
        this.compression = require('compression');
        //this.cookieSession = require('cookie-session');
        this.bodyParser = require('body-parser');
        this.serveStatic = require('serve-static')
        this.logger = require('morgan');
        //this.favicon = require('serve-favicon');
        //this.cookieParser = require('cookie-parser');
        this.path = require('path');
        this.validator = require('express-validator');

        this.routes = require('./routes');
    },
    initExpress: function(){
        this.express = this.Express();
        
    },
    sets: function(){        
        this.express.set('views', this.path.join(baseDir, 'views'));
        this.express.set('view engine', 'jsx');
        this.express.engine('jsx', require('express-react-views').createEngine({ jsx: { harmony: true } }));
    },
    usages: function(){
        
        var me = this;
        
        //this.express.use(this.favicon(this.staticDir + '/favicon.ico'));
        this.express.use(this.logger(this.isDebug ? 'dev' : 'short'));
        //this.express.use(this.cookieParser());

        this.express.use(this.compression({filter: function shouldCompress(req, res) {
          if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false;
          }

          // fallback to standard filter function
          return me.compression.filter(req, res)
        }}));

        //this.express.use(this.cookieSession({ keys: ['8D62B6C1-56BF-472F-840D-5D61CF16928C', 'F0582C8F-D3F1-48C1-8628-1C707525476A'] }));
        this.express.use(this.bodyParser.json());
        this.express.use(this.bodyParser.urlencoded({ extended: true }));
        this.express.use(this.validator()); 
    },
    initRoutes: function(){
        this.isDebug && this.express.use('/', this.Express.static(this.tmpDir, {
          dotfiles: 'ignore',
          etag: true,
          lastModified: true,
          redirect: true
        }));
        this.isDebug && this.express.use('/', this.Express.static(this.staticDir, {
          dotfiles: 'ignore',
          extensions: ['html', 'htm'],
          etag: true,
          index: ['index.html', 'index.htm'],
          lastModified: true,
          redirect: true
        }));
        this.express.use('/', this.Express.static(this.distrDir, {
          dotfiles: 'ignore',
          extensions: ['html', 'htm'],
          etag: true,
          index: ['index.html', 'index.htm'],
          lastModified: true,
          redirect: true
        }));
        // this.express.use('/jsx', this.Express.static(this.renderComponentsDir, {
          // dotfiles: 'ignore',
          // extensions: [],
          // etag: true,
          // index: [],
          // lastModified: true,
          // redirect: false
        // }));
        this.routes.register(this);

    },
    start: function(){
        var me = this;
        console.log('start server http://%s:%s', 'localhost', this.port);
        this.server = this.express.listen(this.port, function () {

            var address = me.server.address();
            var host = address.address;
            var port = address.port;

            console.log('app listening at http://%s:%s', host, port);

        });
    }
};

module.exports = Application;
    
})(module, require, process, __dirname, console, undefined);