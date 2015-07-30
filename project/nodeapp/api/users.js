'use strict';

var uuid = require('node-uuid');
var db = require('../db/connection');
var error = require('../lib/error');
var validate = require('../lib/validate');
var Pipes = require('../lib/pipes');
var hash = require('../lib/hash');

module.exports = {
  get: function(req, res/*, next*/){

      db('users')
        .select('id', 'name', 'last_accessed_at')
        .then(function(row){
            res.json(row);
        })
        .catch(function(ex){
            error(res, ex, 500);
        });

    },
  post: new Pipes()
    .add(validate(function(req) {

      req.checkBody('name', 'name should be not empty').notEmpty();
      req.checkBody('password', 'password should be not empty').notEmpty();

    }))
    .done(function(req, res, next) {

        /*eslint-disable camelcase, no-spaced-func*/
        var name = req.body.name;
        var password = req.body.password;
        var token, id, last_accessed_at;

        db('users')
          .where({name: name})
          .first('id', 'name', 'password_hash')
          .then(function(row) {
            if (row) {
              return row;
            }

            error(res, 'user not found', 404);

            return false;
          })
          .then(function(row) {
            if (!row) {
              return false;
            }

            var isValid = hash(password) === row.password_hash;

            if (!isValid) {
              error(res, 'wrong password', 403);

              return false;
            }

            id = row.id;
            token = row.token = uuid.v4();
            last_accessed_at = row.last_accessed_at = new Date();

            return db('users')
              .where({ id: row.id })
              .update({
                token: row.token,
                last_accessed_at: row.last_accessed_at
              });
          })
          .then(function(result) {
            if(!result){
              return false;
            }

            res.json({
              id: id,
              token: token,
              last_accessed_at: last_accessed_at
            });
          })
          .catch (next);
      /*eslint-enable camelcase, no-spaced-func*/
    }),
  //],
  put: new Pipes()
    .add(validate(function(req) {

      req.checkBody('name', 'name length should be 1-255 chars').isLength(1, 255);
      req.checkBody('password', 'password length should be 1-25 chars').isLength(1, 25);

    }))
    .done(function(req, res/*, next*/) {

      /*eslint-disable camelcase*/
      var name = req.body.name;
      var password = req.body.password;
      var token, last_accessed_at;

      db('users')
        .first('id', 'name')
        .where({ name: name })
        .then(function(row) {
          if (row) {
            throw 'User "' + name + '" already exists';
          } else {
            return true;
          }
        })
        .then(function (result) {

          token = result.token = uuid.v4();
          last_accessed_at = result.last_accessed_at = new Date();

          return db('users')
            .insert({
              name: name,
              password_hash: hash(password),
              token: token,
              last_accessed_at: last_accessed_at
            }, 'id');
        })
        .then(function(ids) {
          if(!ids || !ids.length){
            throw 'failed to create a user, insert failed';
          }

          res.json({
            id: ids[0],
            token: token,
            last_accessed_at: last_accessed_at
          });
        })
        .catch(function(ex) {
          error(res, ex, 500);
        });
      /*eslint-enable camelcase*/

    }),
  delete: function(req, res/*, next*/) {
      db('users')
        .where({id: req.user.id})
        .del()
        .then(function(result) {
            if(!result){
                throw 'failed to delete user ' + req.user.id;
            }

            res.json({success: true});
        })
        .catch(function(ex) {
            error(res, ex, 500);
        });

    }
};
