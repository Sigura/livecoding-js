+(function(module, require, process, baseDir, console, undefined){
'use strict';

var App = require('./main');
var port = process.env.port || 3000;
var app = new App(port);

app.start();

})(module, require, process, __dirname, console, undefined);