+(function(module, require){

    var moment = require('moment');
    var db = require('../db/connection');
    require('twix');

    var error = function(res, text){
        res.status(403);

        res.json({error: text});
    };

    module.exports = function() {
        return function(req, res, next) {

            var token = req.get('Authorization');

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
                            /*eslint-disable camelcase*/
                            .twix(row.last_accessed_at)
                            /*eslint-enable camelcase*/
                            .count('days');

                        //console.log(daysFromLastLogin, moment()
                        //    .twix(row.last_accessed_at)
                        //    .count('minutes'));

                        if(daysFromLastLogin > 7) {
                            error(res, 'token expired');

                            return false;
                        }

                        return db('users')
                            .where({token: token})
                            /*eslint-disable camelcase*/
                            .update({last_accessed_at: new Date()});
                            /*eslint-enable camelcase*/
                    }
                })
                .then(function(/*result*/) {
                    if( req.user ) {
                        next();
                    }
                })
                .catch(next);
        };
    };

})(module, require);
