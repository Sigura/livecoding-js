+(function(module){
'use strict';

var actions = {
  sigIn: 'userSigin',
  apiError: 'apiError',
  loginFailed: 'loginFailed',
  registerFailed: 'registerFailed',
  expensesLoaded: 'expensesLoaded',
  expensesLoadError: 'expensesLoadError',
  groupChanged: 'groupChanged',
  expenseUpdated: 'expenseUpdated',
  expenseUpdateError: 'expenseUpdateError',
  expenseInserted: 'expenseInserted',
  expenseInsertError: 'expenseInsertError',
  expenseDeleted: 'expenseDeleted',
  expenseDeleteError: 'expenseDeleteError',
  copyToNewExpense: 'copyToNewExpense',
};

module.exports = actions;

})(module);