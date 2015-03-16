+(function(global, require){
'use strict';

var knex = require('../db/connection');
var chai = require("chai");
var Promise = require('bluebird');
var request = require('supertest-as-promised');
var queryString = require('query-string');
var App = require('../main');

chai.should();
chai.use(require('chai-things'));

global.expect = chai.expect;
global.lodash = require('lodash');
global.app = (new App()).express;
global.Promise = Promise;
global.queryString = queryString;
global.request = function() {
    return request(app);
};
global.cleanDb = function () {
    before(function(done) {
        return Promise.all([
            knex('expenses').delete(), 
            knex('users').delete()
        ]).then(function(){
            done();
        });
    });
};

before(function(done) {

    console.info('rebuild test db');
    knex.raw('drop schema public cascade; create schema public;')
        .then(function() {
            return knex.migrate.latest();
        })
        .then(function() {
            done();
        });

});

beforeEach(function(){
    //cleanDb();
});


})(global || window, require);