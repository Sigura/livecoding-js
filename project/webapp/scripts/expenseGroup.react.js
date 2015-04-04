+((module, require, moment, Flux, $, undefined, window) => {
'use strict';

let React           = require('react'),
    ReactIntl       = require('react-intl'),
    objectAssign    = require('object-assign'),
    resourceContext = require('./context.react'),
    groupBy         = require('./groupBy.react'),
    Expense         = require('./expense.react'),
    IntlMixin       = ReactIntl.IntlMixin,
    FormattedNumber = ReactIntl.FormattedNumber,
    actions         = require('./actions.react'),
    AppDispatcher   = new Flux.Dispatcher();

class ExpenseGroup extends React.Component {

    constructor(props, context){

        super(props, context);

        this.state = {expenses:[], groupBy: 'all'};
    }

    componentDidMount() {

        AppDispatcher.register((action) => {
            switch(action.actionType)
            {
                case actions.groupChanged:
                    console.log(action.data);
                break;
            }
        });
        
    }

    render () {
        let _ = this;
        let state = _.state;
        let expenses = _.props.expenses;
        let len = expenses.length;
        let sum = expenses.reduce((previousValue, currentValue, index, array) => previousValue + (Number(array[index].amount) || 0), 0);
        let maxDate = len && expenses[0].date;
        let minDate = len && expenses[len - 1].date;
        let duration = (len && moment(maxDate).twix(minDate)) || (len && 1) || 0;
        let days = (duration && duration.count('days')) || (len && 1) || 0;
        let dayAvg = days && sum/len || 0;        
        let expenseList = expenses.map(function(expense) {
            return <Expense key={'expense-' + expense.id} expense={expense} />;
        });
        let summary = (
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
}

module.exports = ExpenseGroup;

})(module, require, moment, Flux, jQuery, undefined, window);