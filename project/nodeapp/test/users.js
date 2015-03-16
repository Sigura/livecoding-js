(function (global, require, request) {
  'use strict';

  describe('/api/users', function () {
    describe('register & login', function () {
        var result;
        cleanDb();
        before(function() {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                }).then(function(res) {
                    result = res;
                });
        });
        it('register returns 200', function() {
            expect(result.status).to.eql(200);
        });
        it('allows to log in as agdudnik@gmail.com', function() {
            return request()
            .post('/api/users')
            .send({
                name: 'agdudnik@gmail.com',
                password: 'test'
            })
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.property('token');
                expect(res.body).to.have.property('id');
            });
        });
    });
    describe('register exists user', function () {
        var result;
        cleanDb();
        before(function() {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                })
                .then(function(res) {
                    result = res;
                });
        });
        it('register returns 200', function() {
            expect(result.status).to.eql(200);
        });
        it('register agdudnik@gmail.com again', function() {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                })
                .expect(500)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
    });
    describe('register with invalid values', function () {
        var result;
        cleanDb();
        it('register returns 200', function() {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: ''
                })
                .expect(400)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
    });
    describe('login with invalid values', function () {
        var result;
        cleanDb();
        it('register returns 200', function() {
            return request()
                .post('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: ''
                })
                .expect(400)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
    });
    describe('login with wrong login', function () {
        var result;
        cleanDb();
        before(function() {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                })
                .then(function(res) {
                    result = res;
                });
        });
        it('register returns 200', function() {
            expect(result.status).to.eql(200);
        });
        it('login with wrong login', function() {
            return request()
                .post('/api/users')
                .send({
                    name: 'agdudnik111',
                    password: 'test'
                })
                .expect(404)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
    });
    describe('login with wrong password', function () {
        var result;
        cleanDb();
        before(function() {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                })
                .then(function(res) {
                    result = res;
                });
        });
        it('register returns 200', function() {
            expect(result.status).to.eql(200);
        });
        it('login with wrong password', function() {
            return request()
                .post('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test1'
                })
                .expect(403)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
    });

  });
})(global || window, require, request);
