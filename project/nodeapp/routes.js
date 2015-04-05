'use strict';

module.exports = {
    routeTable: [
        {path: './api/users'},
        {path: './api/expenses'}
    ],
    register(main){
        
        this.registerRoutes(main);

        this.registerErrors(main);
    },
    registerRoutes(main){

        this.routeTable.forEach(function(item){
            let page = require(item.path);

            main.express.use(page.use(main));
        });

    },
    registerErrors(main){

        main.express.use(function(req, res, next) {
            let err = new error('Not Found');
            err.status = 404;
            
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (main.isDebug) {
            main.express.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.json({
                    title: 'Error 500: ' + err.message,
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        main.express.use(function(err, req, res, next) {
            res.status(err.status || 500);

            res.json({
                title: 'Error 500',
                message: err.message,
                error: {}
            });
        });

    }
};    
