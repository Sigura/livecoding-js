+(function(module, require, moment, React, ReactIntl, $, undefined, window){
'use strict';

var IntlMixin       = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var L = ReactIntl.FormattedMessage;
var groupBy = require('./groupBy.react');
var actions = require('./actions.react');
var Alerts = require('./alerts.react');
var GroupBy = require('./groupByFilter.react');
var Filter = require('./filter.react');
var ExpenseGroup = require('./expenseGroup.react');
var NewExpense = require('./newExpense.react');
var api = require('./api.react');
var AppDispatcher = require('./dispatcher.react');

var Expenses = React.createClass({
  mixins: [IntlMixin],
  getInitialState: function() {
    return {
      groupBy: groupBy.All,
      newExpense: {},
      expenses: [],
      items: {'all': []},
      groups: ['all'],
      format: '',
      loading: true,
    };
  },

  componentDidMount: function() {

    var _ = this;
  
    AppDispatcher.register(function(action){

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
  },
  onUpdate: function(expense) {
    var _ = this;
    var state = _.state;
    
    var index = _.findExpense(expense);
    
    if(index > -1 ) {
      state.expenses.splice(index, 1, expense);
      
      _.update(state.expenses);
    }
  },
  findExpense: function (expense) {
    var _ = this;
    var state = _.state;
    
    var o = state.expenses.filter(function(item){
      return item.id === expense.id;
    }).pop();
    
    var index = state.expenses.indexOf(o);
      
    return index;
  },
  onDelete: function(expense) {
    var _ = this;
    var state = _.state;
    
    var index = _.findExpense(expense);
    
    if(index > -1 ) {
      state.expenses.splice(index, 1);
      
      _.update(state.expenses);
    }
  },
  //componentWillUnmount: function() { },
  dateLoaded: function(list){
    var state = this.state;
    var _ = this;
    var expenses = state.expenses = state.expenses || [];
    expenses.length && expenses.splice(0, expenses.length);
    
    list.forEach(function(item){
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
  },
  update: function(expenses, groupBy) {
    var state = this.state;
    var _ = this;
    expenses = _.sort(expenses);
    var grouped = _.groupDictionary(expenses, groupBy);

    _.setState(grouped);
    _.setState({loading: false});
  },
  // simulateChange: function(ev){
    // React.addons.TestUtils.simulateNativeEventOnNode('topInput', ev.target, {type:'input', target: ev.target});
    // ev.stopImmediatePropagation();      
  // },
  sort: function(expenses){
    var state = this.state;

    expenses.sort(function(a, b) {
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
  },
  addNewExpense: function(add){
    var _ = this;
    var state = _.state;

    state.expenses.push(add);

    _.update(state.expenses);
  },
  filterChanged: function (filter) {
      //console.log('filter', filter);
      api.expenses.get(filter);
  },
  changeGroupHandler: function(groupBy){
    this.setState({groupBy: groupBy});
    
    this.update(this.state.expenses, groupBy);
  },
  groupFormat: function(groupByLabel){
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
  },
  groupDictionary: function(expenses, groupBy) {
    var _ = this;
    var state = _.state;
    var groupDictionary, groups = [], groupFormat = _.groupFormat(groupBy || state.groupBy);

    if(groupFormat) {
      groupDictionary = {};
      expenses.forEach(function(item) {
        var key = moment(item.date).format(groupFormat);
        var groupExists = key in groupDictionary;
        groupDictionary[key] = groupDictionary[key] || [];
        groupDictionary[key].push(item);
        !groupExists && groups.push(key);
      });
    }
    return groupDictionary ? {items: groupDictionary, groups: groups, format: groupFormat} : {items: {'all': state.expenses}, groups: ['all'], format: ''};
  },
  l10n: function(messageName){
    return this.getIntlMessage(messageName);
  },
  logOut: function(){
      AppDispatcher.dispatch({actionType:actions.logOut});
  },
  render: function() {
    var _ = this;
    var cx = React.addons.classSet;
    var state = _.state;
    var len = state.expenses && state.expenses.length || 0;
    var maxDate = len && state.expenses[0].date;
    var minDate = len && state.expenses[len - 1].date;
    var sum = state.expenses.reduce(function(previousValue, currentValue, index, array) {
      return previousValue + (Number(array[index].amount) || 0);
    }, 0);
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
    var groups  = state.groups;
    var items  = state.items;
    var width100P = {width: '100%'};

    return (
      <div className="expenses-list panel panel-default">
        <div className="panel-heading">
          <div className="btn-toolbar pull-right hidden-print"><a className="btn btn-default logout" href="javascript:void(0);" onClick={_.logOut}>Logout</a></div>
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
              <GroupBy groupBy={state.groupBy} onGroupChanged={_.changeGroupHandler} />
              <Filter onFilterChanged={_.filterChanged} />
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
});

module.exports = Expenses;

})(module, require, moment, React, ReactIntl, jQuery, undefined, window);