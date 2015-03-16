+(function (global) {
'use strict';

    var token, token2;
    var registerTestUsers = function() {
        var p1 = request()
            .put('/api/users')
            .send({
                name: 'agdudnik@gmail.com',
                password: 'test'
            })
            .expect(200)
            .then(function(res) {
                token = res.body.token;
            });
        var p2 = request()
            .put('/api/users')
            .send({
                name: 'test-user2',
                password: 'test'
            })
            .expect(200)
            .then(function(res) {
                token2 = res.body.token;
            });
        return Promise.all([p1, p2]);
    };
  
  describe('/api/expenses', function () {
    describe('expense create', function () {
        var result;
        cleanDb();
        before(function() {
            return registerTestUsers();
        });
        
        it('create returns 200', function() {
            return request()
                .put('/api/expenses?token=' + token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-03-16',
                    time: '10:10'
                })
                .expect(200)
                .then(function(res) {
                    result = res;
                });
        });
        it('create with wrong values', function() {
            return request()
                .put('/api/expenses?token=' + token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 12,
                    date: '',
                    time: '10:10'
                })
                .expect(400)
                .then(function(res) {
                    console.log(res.body.error.errors);
                    expect(res.body)
                        .to.have.property('error')
                        .to.have.property('message');
                    expect(res.body.error).to.have.property('errors')
                        .that.is.a('array')
                        .to.contain.an.item.with.property('msg', 'date format is YYYY-MM-DD');
                });
        });
        it('get expenses', function() {
            return request()
                .get('/api/expenses?token=' + token)
                .expect(200)
                .then(function(res) {
                    expect(res.body).to.have.length(1);
                    expect(res.body).to.contain.an.item.with.property('id', result.body.id);
                });
        });
        it('check rights', function() {
            return request()
                .get('/api/expenses?token=' + token2)
                .expect(200)
                .then(function(res) {
                    expect(res.body).to.have.length(0);
                });
        });
    });
    describe('expense update', function () {
        var result;
        cleanDb();
        before(function() {
            return registerTestUsers();
        });
        before(function() {
            return request()
                .put('/api/expenses?token=' + token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-03-16',
                    time: '10:10'
                })
                .expect(200)
                .then(function(res) {
                    result = res.body;
                });
        });
        
        it('update returns 200', function() {
            console.log('id: ', result.id);
            var update = {
                id: result.id,
                description: 'test expense1',
                comment: 'comment1',
                amount: 22,
                date: '2015-03-15',
                time: '10:10'
            };
            return request()
                .post('/api/expenses?token=' + token)
                .send(update)
                .expect(200)
                .then(function(res) {
                    expect(res.body).to.have.property('id', result.id);
                    expect(res.body).to.have.property('description', update.description);
                });
        });
        it('get expenses after update', function() {
            return request()
            .get('/api/expenses?token=' + token)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(1);
                expect(res.body).to.contain.an.item.with.property('id', result.id);
                expect(res.body).to.contain.an.item.with.property('description', 'test expense1');
            });
        });
        it('check rights after update', function() {
            return request()
            .get('/api/expenses?token=' + token2)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(0);
            });
        });
    });

    describe('expense delete', function () {
        var result;
        cleanDb();
        before(function() {
            return registerTestUsers();
        });
        before(function() {
            return request()
                .put('/api/expenses?token=' + token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-03-16',
                    time: '10:10'
                })
                .expect(200)
                .then(function(res) {
                    result = res.body;
                });
        });
        
        it('delete unexistance', function() {
            console.log('id: ', result.id);
            var update = {
                id: 100
            };
            return request()
                .delete('/api/expenses?token=' + token)
                .send(update)
                .expect(404);
        });

        it('delete returns 200', function() {
            console.log('id: ', result.id);
            var update = {
                id: result.id
            };
            return request()
                .delete('/api/expenses?token=' + token)
                .send(update)
                .expect(200);
        });
        it('check existance', function() {
            return request()
            .get('/api/expenses?token=' + token)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(0);
            });
        });
        it('check rights after delete', function() {
            return request()
            .get('/api/expenses?token=' + token2)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(0);
            });
        });
    });
    
    describe('check auth', function () {
        var result;
        cleanDb();
        it('get expenses without token', function() {
            return request()
            .get('/api/expenses?token=undefined')
            .expect(403);
        });
    });
});

})(global || window);
