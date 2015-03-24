+(function(module, require, React, ReactIntl, localStorage){
'use strict';

var IntlMixin       = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var groupBy = require('./groupBy.react');
var actions = require('./actions.react');
var AppDispatcher = require('./dispatcher.react');

var GroupByFilter = React.createClass({
  groupByWeek: function(){
    AppDispatcher.dispatch({actionType: actions.groupChanged, data: {groupBy: groupBy.Week}});
    this.props.onGroupChanged(groupBy.Week);
  },
  groupByMonth: function(){
    AppDispatcher.dispatch({actionType: actions.groupChanged, data: {groupBy: groupBy.Month}});
    this.props.onGroupChanged(groupBy.Month);
  },
  groupByYear: function(){
    AppDispatcher.dispatch({actionType: actions.groupChanged, data: {groupBy: groupBy.Year}});
    this.props.onGroupChanged(groupBy.Year);
  },
  withoutGroup: function(){
    AppDispatcher.dispatch({actionType: actions.groupChanged, data: {groupBy: groupBy.All}});
    this.props.onGroupChanged(groupBy.All);
  },
  render: function(){
    var _ = this;
    var cx = React.addons.classSet;
    
    return (<div>
        <div className="panel panel-default hidden-print">
            <div className="panel-heading">Group by</div>
            <div className="panel-body">
              <div className="btn-group" role="group">
                <button type="button" onClick={_.groupByWeek} className={cx({active: _.props.groupBy === groupBy.Week, btn:true, 'btn-default': true})}>by Week</button>
                <button type="button" onClick={_.groupByMonth} className={cx({active: _.props.groupBy === groupBy.Month, btn:true, 'btn-default': true})}>by Month</button>
                <button type="button" onClick={_.groupByYear} className={cx({active: _.props.groupBy === groupBy.Year, btn:true, 'btn-default': true})}>by Year</button>
                <button type="button" onClick={_.withoutGroup} className={cx({active: _.props.groupBy === groupBy.All, btn:true, 'btn-default': true})}>Ungroup</button>
              </div>
            </div>
        </div>
    </div>);
  }
});

module.exports = GroupByFilter;

})(module, require, React, ReactIntl, localStorage);