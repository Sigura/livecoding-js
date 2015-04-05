//+(function(module, require, process, baseDir, console, undefined){
'use strict';

let App = require('./main');
let port = process.env.port || 3000;
let app = new App(port);

app.start();

//})(module, require, process, __dirname, console, undefined);