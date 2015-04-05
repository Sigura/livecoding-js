'use strict';

import React              from 'react';
import {FormattedNumber}  from 'react-intl';
import objectAssign       from 'object-assign';
import Expense            from './expense.react';
import AppDispatcher      from '../dispatcher/dispatcher.react';
import resourceContext    from '../utils/context.react';
import groupBy            from '../constants/groupBy.react';
import actions            from '../constants/actions.react';

export default class ExpenseGroup extends React.Component {

    constructor(props, context){

        super(props, context);

        this.state = {expenses: [], groupBy: 'all'};
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
        let expenses = _.props.expenses;
        let len = expenses.length;
        let sum = expenses.reduce((previousValue, currentValue, index, array) => previousValue + (Number(array[index].amount) || 0), 0);
        let maxDate = len && expenses[0].date;
        let minDate = len && expenses[len - 1].date;
        let duration = (len && moment(maxDate).twix(minDate)) || (len && 1) || 0;
        let days = (duration && duration.count('days')) || (len && 1) || 0;
        let dayAvg = (days && len && (sum/len)) || 0;
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
