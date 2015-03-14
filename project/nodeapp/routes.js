'use strict';

+(function(module, require, error){

module.exports = {
    routeTable: [
        {path: './api/users'},
        {path: './api/expenses'}
    ],
    register: function(main){
        
        this.registerRoutes(main);

        this.registerErrors(main);
    },
    registerRoutes: function(main){

        this.routeTable.forEach(function(item){
            var page = require(item.path);

            main.app.use(page.use(main));
        });

    },
    registerErrors: function(main){

        main.app.use(function(req, res, next) {
            var err = new error('Not Found');
            err.status = 404;
            
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (main.isDebug) {
            main.app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    title: 'Error 500: ' + err.message,
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        main.app.use(function(err, req, res, next) {
            res.status(err.status || 500);

            res.render('error', {
                title: 'Error 500',
                message: err.message,
                error: {}
            });
        });

    }
};    

})(module, require, Error)
