+(function(module, require, process){

    var db = require('../db/connection');
    var error = function(res, text){
        res.status(403);

        res.json({error: text});
    };
        
    module.exports = function() {
        return function(req, res, next) {

            var token = req.query.token;
        
            if (!token) {

                error(res, 'token not provided');

                return;
            }

            db('users')
                .where({token: token})
                .first()
                .then(function(row) {
                    req.user = row;

                    //todo: check expiration

                    if (!row) {
                        error(res, 'invalid token');
                        
                        return false;
                    } else {
                        return db('users')
                            .where({token: token})
                            .update({last_accessed_at: new Date()});
                    }
                })
                .then(function(res) {
                    if( req.user ) {
                        next();
                    }
                })
                .catch(next);
        };
    };

})(module, require, process);