+((module, require, moment, $, localStorage, undefined, window) => {
'use strict';

let React           = require('react'),
    ReactIntl       = require('react-intl'),
    resourceContext = require('./context.react'),
    resources       = require('./resources.react'),
    objectAssign    = require('object-assign'),
    extensions      = require('./extensions.react'),
    IntlMixin       = ReactIntl.IntlMixin,
    FormattedNumber = ReactIntl.FormattedNumber,
    L               = ReactIntl.FormattedMessage,
    groupBy         = require('./groupBy.react'),
    actions         = require('./actions.react'),
    Alerts          = require('./alerts.react'),
    GroupBy         = require('./groupByFilter.react'),
    Filter          = require('./filter.react'),
    ExpenseGroup    = require('./expenseGroup.react'),
    NewExpense      = require('./newExpense.react'),
    api             = require('./api.react'),
    AppDispatcher   = require('./dispatcher.react');

class Expenses extends React.Component {

    constructor(props, context){

        super(props, context);

        this.state = this.getInitState();
    }

    getInitState() {
            
        var gb = groupBy.All;
        try{
                gb = localStorage.groupBy || groupBy.All;

                if(gb === 'undefined') {
                        gb = groupBy.All;
                }
        }catch(e){}

            
        return {
            groupBy: gb,
            newExpense: {},
            expenses: [],
            items: {'all': []},
            groups: ['all'],
            format: '',
            loading: true,
        };
    }

    componentDidMount() {

        var _ = this;
    
        AppDispatcher.register((action) => {

            switch(action.actionType)
            {
                case actions.expenseUpdated:
                    _.onUpdate(action.data);
                break;
                case actions.groupChanged:
                    _.setState(action.data);
                break;
                case actions.expensesLoaded:
                    _.dateLoaded(action.data);
                break;
                case actions.expenseInserted:
                    _.addNewExpense(action.data);
                break;
                case actions.expenseDeleted:
                    _.onDelete(action.data);
                break;
                case actions.expensesLoadError:
                    _.dateLoaded([]);
                break;
            }
        });
        
        api.expenses.get();
    }
    
    onUpdate(expense) {
        var _ = this;
        var state = _.state;
        
        var index = _.findExpense(expense);
        
        if(index > -1 ) {
            state.expenses.splice(index, 1, expense);
            
            _.update(state.expenses);
        }
    }
    
    findExpense (expense) {
        var _ = this;
        var state = _.state;
        
        var o = state.expenses.filter((item) => item.id === expense.id).pop();
        
        var index = state.expenses.indexOf(o);
            
        return index;
    }
    
    onDelete(expense) {
        var _ = this;
        var state = _.state;
        
        var index = _.findExpense(expense);
        
        if(index > -1 ) {
            state.expenses.splice(index, 1);
            
            _.update(state.expenses);
        }
    }
    //componentWillUnmount() { },
    dateLoaded(list){
        var state = this.state;
        var _ = this;
        var expenses = state.expenses = state.expenses || [];
        expenses.length && expenses.splice(0, expenses.length);
        
        list.forEach(item => {
            expenses.push({
                id: item.id,
                description: item.description,
                date: item.date.substring(0, 10),
                time: item.time && item.time.length > 5 ? item.time.substring(0, 5) : item.time,
                amount: item.amount,
                comment: item.comment,
                user_id: item.user_id
            })
        });

        _.update(expenses);
    }
    
    update(expenses, groupBy) {
        var state = this.state;
        var _ = this;
        expenses = _.sort(expenses);
        var grouped = _.groupDictionary(expenses, groupBy);
        localStorage.groupBy = groupBy;

        _.setState(grouped);
        _.setState({loading: false});
    }
    // simulateChange(ev){
        // React.addons.TestUtils.simulateNativeEventOnNode('topInput', ev.target, {type:'input', target: ev.target});
        // ev.stopImmediatePropagation();            
    // },
    sort(expenses){
        var state = this.state;

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
        var _ = this;
        var state = _.state;

        state.expenses.push(add);

        _.update(state.expenses);
    }
    
    filterChanged (filter) {
            //console.log('filter', filter);
            api.expenses.get(filter);
    }
    
    changeGroupHandler(groupBy){
        this.setState({groupBy: groupBy});
        
        this.update(this.state.expenses, groupBy);
    }
    
    groupFormat(groupByLabel){
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
    
    groupDictionary(expenses, groupBy) {
        var _ = this;
        var state = _.state;
        var groupDictionary, groups = [], groupFormat = _.groupFormat(groupBy || state.groupBy);

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
    
    logOut(){
            AppDispatcher.dispatch({actionType:actions.logOut});
    }
    
    render() {
        var _ = this;
        var cx = _.classSet;
        var state = _.state;
        var len = state.expenses && state.expenses.length || 0;
        var maxDate = len && state.expenses[0].date;
        var minDate = len && state.expenses[len - 1].date;
        var sum = state.expenses.reduce((previousValue, currentValue, index, array) => previousValue + (Number(array[index].amount) || 0), 0);
        var duration = (len && moment(maxDate).twix(minDate)) || (len && 1) || 0;
        var days = (duration && duration.count('days')) || (len && 1) || 0;
        var avg = (len && sum/len) || 0;
        var dayAvg = (days && sum/days) || 0;
        var weeks = (duration && duration.count('weeks')) || (len && 1) || 0;
        var weekAvg = weeks && sum/weeks || dayAvg;
        var months = (duration && duration.count('months')) || (len && 1) || 0;
        var monthAvg = (months && sum/months) || weekAvg || dayAvg;
        var years = (duration && duration.count('years')) || (len && 1) || 0;
        var yearAvg = (years && sum/years) || monthAvg || weekAvg || dayAvg;
        var groups    = state.groups;
        var items    = state.items;
        var width100P = {width: '100%'};

        return (
            <div className="expenses-list panel panel-default">
                <div className="panel-heading">
                    <div className="btn-toolbar pull-right hidden-print"><a className="btn btn-default logout" href="javascript:void(0);" onClick={_.logOut.bind(_)}>Logout</a></div>
                    <h2><L message={_.l10n('Expenses')}/></h2>
                </div>
                <div className={cx({'panel-body':true, 'hidden-print':true, 'hide-element': !state.loading})}>
                    <div className="progress">
                        <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={width100P}>
                        </div>
                    </div>
                </div>
                <div className={cx({'panel-body':true, 'hide-element': state.loading})}>
                    <Alerts />
                    <div className="col-sm-8">
                            <GroupBy groupBy={state.groupBy} onGroupChanged={_.changeGroupHandler.bind(_)} />
                            <Filter onFilterChanged={_.filterChanged.bind(_)} />
                    </div>
                </div>
                <table className={cx({'table':true, 'table-hover':true, 'table-condensed': true, 'hide-element': state.loading})}>
                    <thead>
                        <tr>
                            <th></th><th><L message={_.l10n('Date')}/></th><th>Time</th><th>Description</th><th>Amount</th><th>Comment</th>
                        </tr>
                    </thead>
                    <tfoot>
                    <tr className="info total">
                        <td>Total:</td>
                        <td colSpan="5"><L message={_.l10n('Total')} avg={avg} length={len} sum={sum} dayAvg={dayAvg} days={days} weekAvg={weekAvg} weeks={weeks} monthAvg={monthAvg} months={months} yearAvg={yearAvg} years={years} /></td>
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

resourceContext.extend(Expenses);

objectAssign(Expenses.prototype, extensions);

module.exports = Expenses;

})(module, require, moment, jQuery, localStorage, undefined, window);