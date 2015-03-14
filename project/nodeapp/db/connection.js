+(function(module, require, process){

    var knexfile = require('./knexfile');
    var envName = process.env.NODE_ENV || 'development';
    var configuration = knexfile[envName];
    
    module.exports = require('knex')(configuration);
    
})(module, require, process)
