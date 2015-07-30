+(function(module, require){

  var moment = require('moment');
  var db = require('../db/connection');
  require('twix');

  var error = function(res, text){
    res.status(403);

    res.json({message: text, status: 403});
  };

  var checkToken = function(token, req) {

    return db('users')
      .where({token: token})
      .first()
      .then(function(row) {
        req.user = row;

        if (!row) {
          throw 'invalid token';
        } else {

          var daysFromLastLogin = moment()
            /*eslint-disable camelcase*/
            .twix(row.last_accessed_at)
            /*eslint-enable camelcase*/
            .count('days');

          //console.log(daysFromLastLogin, moment()
          //  .twix(row.last_accessed_at)
          //  .count('minutes'));

          if(daysFromLastLogin > 7) {
            throw 'token expired';
          }

          db('users')
            .where({token: token})
            /*eslint-disable camelcase*/
            .update({last_accessed_at: new Date()});
            /*eslint-enable camelcase*/

          return req.user;
        }
      });

  };
  var preHandler = function(req, res, next) {

    var token = req.get('Authorization');

    if (!token) {

      error(res, 'token not provided');

      return false;
    }

    return checkToken(token, req)
      .then(function() {
        if( req.user ) {
          next();
        }
      })
      .catch(function(e){ error(res, e); });
      //.catch(next);
  };
  var preHandlerGetter = function() {
    return preHandler;
  };
  preHandlerGetter.checkToken = checkToken;

  module.exports = preHandlerGetter;

})(module, require);
