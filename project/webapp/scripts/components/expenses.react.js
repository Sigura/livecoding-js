'use strict';

import React           from 'react';
import objectAssign    from 'object-assign'
import
{FormattedMessage}     from 'react-intl'
import groupBy         from '../constants/groupBy.react'
import actions         from '../constants/actions.react'
import AppDispatcher   from '../dispatcher/dispatcher.react'
import api             from '../store/api.react'
import extensions      from '../utils/extensions.react'
import context         from '../utils/context.react'

/*eslint-disable no-unused-vars*/
import Alerts          from './alerts.react'
import GroupBy         from './groupByFilter.react'
import Filter          from './filter.react'
import ExpenseGroup    from './expenseGroup.react'
import NewExpense      from './newExpense.react'
/*eslint-enable no-unused-vars*/

export default class Expenses extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = this.getInitState();
    }

    getInitState() {
        return {
            groupBy: (this.props.params && this.props.params.groupBy) || groupBy.All,
            newExpense: {},
            expenses: [],
            items: {[groupBy.All]: []},
            groups: [groupBy.All],
            format: '',
            loading: true
        };
    }

    componentDidMount() {
        this.registerEvents();
        !this.state.expenses.length && api.user.current && api.expenses.get();
    }

    componentWillUnmount() {
        this.listener && AppDispatcher.unregister(this.listener);
    }

    registerEvents() {
        this.listener = this.handleFluxEvents && AppDispatcher.register((action) => this.handleFluxEvents(action));
    }

    handleFluxEvents(action) {
        switch(action.actionType)
        {
            case actions.signIn:
            case actions.userRegistered:
                api.user.current && api.expenses.get();
            break;
            case actions.expenseUpdated:
                this.onUpdate(action.data);
            break;
            case actions.expensesLoaded:
                this.dataLoaded(action.data);
            break;
            case actions.expenseInserted:
                this.addNewExpense(action.data);
            break;
            case actions.expenseDeleted:
                this.onDelete(action.data);
            break;
            case actions.expensesLoadError:
                this.dataLoaded([]);
            break;
        }
    }

    onUpdate(expense) {
        let state = this.state;
        let index = this.findExpense(expense);

        if(index > -1 ) {
            state.expenses.splice(index, 1, expense);

            this.update(state.expenses);
        }
    }

    findExpense (expense) {
        let state = this.state;
        let o = state.expenses.filter((item) => item.id === expense.id).pop();

        return state.expenses.indexOf(o);
    }

    onDelete(expense) {
        let state = this.state;
        let index = this.findExpense(expense);

        if(index > -1 ) {
            state.expenses.splice(index, 1);

            this.update(state.expenses);
        }
    }

    dataLoaded (list) {
        var state = this.state;
        var expenses = state.expenses = state.expenses || [];
        expenses.length && expenses.splice(0, expenses.length);

        list.forEach(item => {
            expenses.push({
                id: item.id,
                description: item.description,
                date: item.date.substring(0, 10),
                time: item.time && item.time.length > 5 ? item.time.substring(0, 5) : item.time,
                amount: item.amount,
                comment: item.comment
            });
        });

        this.update(expenses);
    }

    componentWillReceiveProps(obj){
        let group = (obj.params && obj.params.groupBy) || groupBy.All;
        this.setState({groupBy: group});
        this.update(this.state.expenses, group);
    }

    update(expenses, group) {
        group = group || this.state.groupBy;
        expenses = Expenses.sort(expenses || this.state.expenses);
        let grouped = this.groupDictionary(expenses, group);

        this.setState(grouped);
        this.setState({loading: false, groupBy: group});
    }

    // simulateChange(ev){
        // React.addons.TestUtils.simulateNativeEventOnNode('topInput', ev.target, {type:'input', target: ev.target});
        // ev.stopImmediatePropagation();
    // }

    static sort (expenses) {

        expenses.sort((a, b) => {
            if(a.date > b.date){
                return 1;
            }
            if(a.date < b.date){
                return -1;
            }
            if(a.time > b.time){
                return 1;
            }
            if(a.time < b.time){
                return -1;
            }
            return 0;
        });

        return expenses;
    }

    addNewExpense(add){
        var state = this.state;

        state.expenses.push(add);

        this.update(state.expenses);
    }

    static filterChanged (filter) {
        //console.log('filter', filter);
        api.expenses.get(filter);
    }

    static groupFormat(groupByLabel){
        var groupFormat = null;
        switch(groupByLabel){
            case groupBy.Week:
                groupFormat = 'YYYY-[W]ww';
                break;
            case groupBy.Month:
                groupFormat = 'YYYY-MM';
                break;
            case groupBy.Year:
                groupFormat = 'YYYY';
                break;
        }
        return groupFormat;
    }

    groupDictionary(expenses, group) {
        var state = this.state;
        var groupDictionary, groups = [], groupFormat = Expenses.groupFormat(group || state.groupBy);

        if(groupFormat) {
            groupDictionary = {};
            expenses.forEach((item) => {
                var key = moment(item.date).format(groupFormat);
                var groupExists = key in groupDictionary;
                groupDictionary[key] = groupDictionary[key] || [];
                groupDictionary[key].push(item);
                !groupExists && groups.push(key);
            });
        }
        return groupDictionary ? {items: groupDictionary, groups: groups, format: groupFormat} : {items: {'all': state.expenses}, groups: ['all'], format: ''};
    }

    static logOut(){
        AppDispatcher.dispatch({actionType: actions.logOut});
    }

    render() {
        let _ = this;
        let cx = _.classSet;
        let state = _.state;
        let len = state.expenses && state.expenses.length || 0;
        let maxDate = len && state.expenses[0].date;
        let minDate = len && state.expenses[len - 1].date;
        let sum = state.expenses.reduce((previousValue, currentValue, index, array) => previousValue + (Number(array[index].amount) || 0), 0);
        let duration = (len && moment(maxDate).twix(minDate)) || (len && 1) || 0;
        let days = (duration && duration.count('days')) || (len && 1) || 0;
        let avg = (len && sum/len) || 0;
        let dayAvg = (days && sum/days) || 0;
        let weeks = (duration && duration.count('weeks')) || (len && 1) || 0;
        let weekAvg = weeks && sum/weeks || dayAvg;
        let months = (duration && duration.count('months')) || (len && 1) || 0;
        let monthAvg = (months && sum/months) || weekAvg || dayAvg;
        let years = (duration && duration.count('years')) || (len && 1) || 0;
        let yearAvg = (years && sum/years) || monthAvg || weekAvg || dayAvg;
        let width100P = {width: '100%'};

        return (
            <div className="expenses-list panel panel-default">
                <div className="panel-heading">
                    <div className="btn-toolbar pull-right hidden-print"><a className="btn btn-default logout" href="javascript:void(0);" onClick={Expenses.logOut.bind(_)}>Logout</a></div>
                    <h2><FormattedMessage message={_.l10n('Expenses')}/></h2>
                </div>
                <div className={cx({'panel-body': true, 'hidden-print': true, 'hide-element': !state.loading})}>
                    <div className="progress">
                        <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={width100P}>
                        </div>
                    </div>
                </div>
                <div className={cx({'panel-body': true, 'hide-element': state.loading})}>
                    <Alerts />
                    <div className="col-sm-8">
                        <GroupBy />
                        <Filter onFilterChanged={Expenses.filterChanged} />
                    </div>
                </div>
                <table className={cx({'table': true, 'table-hover': true, 'table-condensed': true, 'hide-element': state.loading})}>
                    <thead>
                        <tr>
                            <th></th><th><FormattedMessage message={_.l10n('Date')}/></th><th>Time</th><th>Description</th><th>Amount</th><th>Comment</th>
                        </tr>
                    </thead>
                    <tfoot>
                    <tr className="info total">
                        <td>Total:</td>
                        <td colSpan="5"><FormattedMessage message={_.l10n('Total')} avg={avg} length={len} sum={sum} dayAvg={dayAvg} days={days} weekAvg={weekAvg} weeks={weeks} monthAvg={monthAvg} months={months} yearAvg={yearAvg} years={years} /></td>
                    </tr>
                    </tfoot>
                    <NewExpense />
                    {state.groups.map(function(name, i) {
                        return <ExpenseGroup key={state.groupBy + name + i} index={i} groupBy={state.groupBy} name={name} expenses={_.state.items[name]} format={state.format} />;
                        })}
                </table>
            </div>
        );
    }

}

context.extend(Expenses);

Expenses.displayName = 'Expenses';

objectAssign(Expenses.prototype, extensions);

