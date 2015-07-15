'use strict';

import AppDispatcher from '../dispatcher/dispatcher.react'
import actions       from '../constants/actions.react'

var api;

export default api = {
  user: {
    signIn (user) {
      return $.ajax('/api/users', {
          dataType: 'json',
          contentType: 'application/json',
          method: 'POST',
          data: JSON.stringify(user)
        })
        .fail((res) => AppDispatcher.dispatch({actionType: actions.loginFailed, data: res.responseJSON}))
        .done((data) => AppDispatcher.dispatch({actionType: actions.signIn, data: data}));
    },
    register (user) {
      return $.ajax('/api/users', {
          dataType: 'json',
          contentType: 'application/json',
          method: 'PUT',
          data: JSON.stringify(user)
        })
        .fail(res => AppDispatcher.dispatch({actionType: actions.registerFailed, data: res.responseJSON}))
        .done(data => AppDispatcher.dispatch({actionType: actions.userRegistered, data: data}));
    }
  },
  expenses: {
    get: (filter) => {
      filter = filter || {};
      return $.ajax('/api/expenses', {
          dataType: 'json',
          contentType: 'application/json',
          method: 'GET',
          headers: {
            Authorization: api.user.current.token
          },
          data: filter
        })
        .fail(res => AppDispatcher.dispatch({actionType: actions.expensesLoadError, data: res.responseJSON}))
        .done(data => AppDispatcher.dispatch({actionType: actions.expensesLoaded, data: data}));
    },
    insert: (expense) => {
      return $.ajax('/api/expenses', {
          dataType: 'json',
          contentType: 'application/json',
          method: 'PUT',
          headers: {
            Authorization: api.user.current.token
          },
          data: JSON.stringify(expense)
        })
        .fail(res => AppDispatcher.dispatch({actionType: actions.expenseInsertError, data: res.responseJSON}))
        .done(data => AppDispatcher.dispatch({actionType: actions.expenseInserted, data: data}));
    },
    update: (expense) => {
      return $.ajax('/api/expenses', {
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        headers: {
        Authorization: api.user.current.token
        },
        data: JSON.stringify(expense)
      })
        .fail(res => AppDispatcher.dispatch({actionType: actions.expenseUpdateError, data: res.responseJSON}))
        .done(data => AppDispatcher.dispatch({actionType: actions.expenseUpdated, data: data}));
    },
    'delete': (expense) => {
      return $.ajax('/api/expenses', {
          dataType: 'json',
          headers: {
            Authorization: api.user.current.token
          },
          contentType: 'application/json',
          method: 'DELETE',
          data: JSON.stringify(expense)
        })
        .fail(res => AppDispatcher.dispatch({actionType: actions.expenseDeleteError, data: res.responseJSON}))
        .done(data => AppDispatcher.dispatch({actionType: actions.expenseDeleted, data: data}));
    }
  }
};

window.getCurrentUser = () => api.user.current;

AppDispatcher.register(action => {
  switch(action.actionType)
  {
    case actions.signIn:
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
