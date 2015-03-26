+(function(module, require, process){

    var moment = require('moment');
    var twix = require('twix');
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

                    if (!row) {
                        error(res, 'invalid token');
                        
                        return false;
                    } else {
                        
                        var daysFromLastLogin = moment()
                            .twix(row.last_accessed_at)
                            .count('days')
                        
                        //console.log(daysFromLastLogin, moment()
                        //    .twix(row.last_accessed_at)
                        //    .count('minutes'));
                        
                        if(daysFromLastLogin > 7) {
                            error(res, 'token expired');
                            
                            return false;
                        }
                    
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