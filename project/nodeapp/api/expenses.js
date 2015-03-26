+(function(module, require){
'use strict';

var uuid = require('node-uuid');
var db = require('../db/connection');
var hash = require('../lib/hash');
var error = require('../lib/error');
var validate = require('../lib/validate');
var controller = require('../lib/controller');
var authentication = require('../lib/authentication');

var path = '/api/expenses';

var expenseController = new controller(path);
var helpers = {
    validate: function (req) {
        req.checkBody('date', 'date format is YYYY-MM-DD').isLength(10).isDate();
        req.checkBody('time', 'time format is HH:mm or empty').matches(/^(((\d|)\d:\d\d)|)$/);
        req.checkBody('description', 'description length should be 1-255 chars').isLength(1, 255);
        req.checkBody('amount', 'amount should be number').isFloat();
        req.checkBody('comment', 'comment should be length should less then 1024 chars').isLength(0, 1024);
    },
    expense: function (req) {
        var res = {
            date: req.body.date,
            time: req.body.time,
            description: req.body.description,
            amount: req.body.amount,
            comment: req.body.comment,
            user_id: req.user.id
        };
        
        if(req.body.id) {
            res.id = req.body.id;
        }
        
        return res;
    }
}

//expenseController.router.use(authentication());

expenseController.router.get(path, authentication(), validate(function (req) {

    //console.log('request', req.query);

    req.query.dateFrom   && req.checkQuery('dateFrom', 'date format is YYYY-MM-DD').isLength(10).isDate();
    req.query.dateTo     && req.checkQuery('dateTo', 'date format is YYYY-MM-DD').isLength(10).isDate();
    req.query.amountFrom && req.checkQuery('amountFrom', 'amount should be number').isLength(0, 7).isFloat();
    req.query.amountTo   && req.checkQuery('amountTo', 'amount should be number').isLength(0, 7).isFloat();
    
}), function (req, res, next) {

    var query = db('expenses')
        .where({user_id: req.user.id});
    
    if(req.query.dateFrom)
        query = query.where('date', '>=', req.query.dateFrom);
    if(req.query.dateTo)
        query = query.where('date', '<=', req.query.dateTo);
    if(req.query.amountFrom)
        query = query.where('amount', '>=', req.query.amountFrom);
    if(req.query.amountTo)
        query = query.where('amount', '<=', req.query.amountTo);
    
    //console.log('query', query);
    
    query
        .orderBy('date')
        .orderBy('time')
        .then(function(row){
            res.json(row);
        })
        .catch(function(ex){
            error(res, ex, 500);
        });
        

});

// delete expense
expenseController.router.delete(path, authentication(), function (req, res, next) {
    var expense = helpers.expense(req);
    
    db('expenses')
        .where({id: expense.id, user_id: req.user.id})
        .del()
        .then(function(result) {
            if(!result){
                throw 'failed to delete expense ' + expense.id;
            }

            res.json(expense);
        })
        .catch(function(ex) {
            error(res, ex, 404);
        });

});

// update expense
expenseController.router.post(path, authentication(), validate(helpers.validate), function (req, res, next) {

    var expense = helpers.expense(req);

    expense.user_id = req.user.id;
    expense.time = expense.time || null;

    db('expenses')
        .where({id: expense.id, user_id: req.user.id})
        .update(expense)
        .then(function(result) {
            if(!result){
                throw 'failed to update expense ' + expense.id;
            }

            res.json(expense);
        })
        .catch(function(ex) {
            error(res, ex, 404);
        });

});

// create new expense
expenseController.router.put(path, authentication(), validate(helpers.validate), function (req, res, next) {

    var expense = helpers.expense(req);

    expense.time = expense.time || null;
    expense.user_id = req.user.id;

    db('expenses')
        .insert(expense, 'id')
        .then(function(ids) {
            if(!ids || !ids.length){
                throw 'failed to create a expense';
            }

            expense.id = ids[0];

            res.json(expense);
        })
        .catch(function(ex) {
            error(res, ex, 500);
        })

    
});

module.exports = expenseController;

})(module, require)
