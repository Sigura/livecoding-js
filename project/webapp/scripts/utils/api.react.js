'use strict';

export default {
  user: {
    signIn (user) {
      return $.ajax('/api/users', {
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify(user)
      });
    },
    register (user) {
      return $.ajax('/api/users', {
          dataType: 'json',
          contentType: 'application/json',
          method: 'PUT',
          data: JSON.stringify(user)
        });
    }
  },
  expenses: {
    get: (filter, user) => {
      filter = filter || {};
      return $.ajax('/api/expenses', {
        dataType: 'json',
        contentType: 'application/json',
        method: 'GET',
        headers: {
          Authorization: user.token
        },
        data: filter
      });
    },
    insert: (expense, user) => {
      return $.ajax('/api/expenses', {
        dataType: 'json',
        contentType: 'application/json',
        method: 'PUT',
        headers: {
          Authorization: user.token
        },
        data: JSON.stringify(expense)
      });
    },
    update: (expense, user) => {
      return $.ajax('/api/expenses', {
        dataType: 'json',
        contentType: 'application/json',
        method: 'POST',
        headers: {
        Authorization: user.token
        },
        data: JSON.stringify(expense)
      });
    },
    del: (expense, user) => {
      return $.ajax('/api/expenses', {
        dataType: 'json',
        headers: {
          Authorization: user.token
        },
        contentType: 'application/json',
        method: 'DELETE',
        data: JSON.stringify(expense)
      });
    }
  }
};
