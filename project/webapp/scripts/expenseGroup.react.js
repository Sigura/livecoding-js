+(function(module, require, moment, React, ReactIntl, Flux, $, undefined, window){
'use strict';

var groupBy = require('./groupBy.react');
var Expense = require('./expense.react');
var IntlMixin       = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var actions = require('./actions.react');
var AppDispatcher = new Flux.Dispatcher();

var ExpenseGroup = React.createClass({
  getInitialState: function() {
    return {expenses:[], groupBy: 'all'};
  },
  componentDidMount: function() {
    var _ = this;

    AppDispatcher.register(function(action){
      switch(action.actionType)
      {
        case actions.groupChanged:
          console.log(action.data);
        break;
        //case actions.expenseUpdated:
        //  _.onUpdate(action.data);
        //break;
      }
    });
    
    //_.setState({expenses:action.data.expenses.items[_.props.name], groupBy: _.props.name});
  },
  //componentWillUnmount: function() {},
  //onUpdate: function(expense){},
  render: function(){
    var _ = this;
    var state = _.state;
    var expenses = _.props.expenses;
    var len = expenses.length;
    var sum = expenses.reduce(function(previousValue, currentValue, index, array) {
      return previousValue + (Number(array[index].amount) || 0);
    }, 0);
    var maxDate = len && expenses[0].date;
    var minDate = len && expenses[len - 1].date;
    var duration = (len && moment(maxDate).twix(minDate)) || (len && 1) || 0;
    var days = (duration && duration.count('days')) || (len && 1) || 0;
    var dayAvg = days && sum/len || 0;    
    var expenseList = expenses.map(function(expense) {
      return <Expense key={'expense-' + expense.id} expense={expense} />;
    });
    var summary = (
      <tr key={'group-total-' + _.props.groupBy + '-' + _.props.name + '-' + _.props.index} className="info group-summary">
        <td colSpan="4">{moment(maxDate).format(_.props.format)}</td>
        <td colSpan="2">Sum: <FormattedNumber value={sum} format="USD" />, Avg: <FormattedNumber value={dayAvg} format="USD" /></td>
      </tr>
    );

    if(_.props.groupBy !== groupBy.All) {
      expenseList.unshift(summary);
    }

    return <tbody>{expenseList}</tbody>;
  }
});

module.exports = ExpenseGroup;

})(module, require, moment, React, ReactIntl, Flux, jQuery, undefined, window);