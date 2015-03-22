+(function(module, Flux){
'use strict';

var actions = require('./actions.react');
var AppDispatcher = require('./dispatcher.react');

var api = {
  user: {
    signIn: function(user){
      return $.ajax('/api/users', {
          dataType: 'json',
          contentType: 'application/json',
          method: 'POST',
          data: JSON.stringify(user)
        })
        .fail(function(res){
            AppDispatcher.dispatch({actionType: actions.loginFailed, data: res.responseJSON});
        })
        .done(function(data){
            AppDispatcher.dispatch({actionType: actions.signIn, data: data});
        });
    },
    register: function(user){
      return $.ajax('/api/users', {
          dataType: 'json',
          contentType: 'application/json',
          method: 'PUT',
          data: JSON.stringify(user),
        })
        .fail(function(res){
            AppDispatcher.dispatch({actionType: actions.registerFailed, data: res.responseJSON});        
        })
        .done(function(data){
            AppDispatcher.dispatch({actionType: actions.userRegistered, data: data});
        });
    },
  },
  expenses: {
    get: function(filter) {
      filter = filter || {};
      filter.token = api.user.current.token;
      return $.ajax('/api/expenses', {
          dataType: 'json',
          contentType: 'application/json',
          method: 'GET',
          data: filter,
        })
        .fail(function(res){
            AppDispatcher.dispatch({actionType: actions.expensesLoadError, data: res.responseJSON});        
        })
        .done(function(data){
            AppDispatcher.dispatch({actionType: actions.expensesLoaded, data: data});
        });
    },
    insert: function(expense){
      return $.ajax('/api/expenses?token=' + api.user.current.token, {
          dataType: 'json',
          contentType: 'application/json',
          method: 'PUT',
          data: JSON.stringify(expense)
        })
        .fail(function(res){
            AppDispatcher.dispatch({actionType: actions.expenseInsertError, data: res.responseJSON});        
        })
        .done(function(data){
            AppDispatcher.dispatch({actionType: actions.expenseInserted, data: data});
        });
    },
    update: function(expense){
      return $.ajax('/api/expenses?token=' + api.user.current.token, {
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify(expense)
      })
        .fail(function(res){
            AppDispatcher.dispatch({actionType: actions.expenseUpdateError, data: res.responseJSON});        
        })
        .done(function(data){
            AppDispatcher.dispatch({actionType: actions.expenseUpdated, data: data});
        });
    },
    'delete': function(expense){
      return $.ajax('/api/expenses?token=' + api.user.current.token, {
          dataType: 'json',
          contentType: 'application/json',
          method: 'DELETE',
          data: JSON.stringify(expense)
        })
        .fail(function(res){
            AppDispatcher.dispatch({actionType: actions.expenseDeleteError, data: res.responseJSON});
        })
        .done(function(data){
            AppDispatcher.dispatch({actionType: actions.expenseDeleted, data: data});
        });
    }
  }
};

AppDispatcher.register(function(action) {
  switch(action.actionType)
  {
    case actions.sigIn:
    case actions.userRegistered:
      api.user.current = action.data;
    break;
    case actions.logout:
    case actions.loginFailed:
    case actions.registerFailed:
      api.user.current = {};
    break;
  }
});

module.exports = api;

})(module, Flux);