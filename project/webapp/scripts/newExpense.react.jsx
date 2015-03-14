+(function(module, require, React, ReactIntl, $, undefined, window){
'use strict';

var IntlMixin       = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var groupBy = require('./groupBy.react');
var actions = require('./actions.react');
var AppDispatcher = require('./dispatcher.react');
var api = require('./api.react');
var L = ReactIntl.FormattedMessage;

var NewExpense = React.createClass({
  mixins: [React.addons.LinkedStateMixin, IntlMixin],
  onChange: function(e){
    var update = {};

    update[e.target.name] = e.target.value;
    
    this.setState(update);
  },
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    var _ = this;

    AppDispatcher.register(function(action){

      switch(action.actionType)
      {
        case actions.copyToNewExpense:
          _.fill(action.data);
        break;
      }
    });
    
    _.setState(_.props.expense || {});
    _.buildComponents();
  },
  componentDidUpdate: function(prevProps, prevState){
    this.buildComponents();
  },
  fill: function(expense){
    this.setState(expense);
  },
  buildComponents: function(){
    var _ = this;

    if(_.refs.Time)
    $(_.refs.Time.getDOMNode())
      .timepicker({
        minuteStep: 10,
        appendWidgetTo: 'body',
        showMeridian: false,
        defaultTime: 'current'
      }).on('changeTime.timepicker', function(e){
        _.setState({time: e.target.value});
      });
    if(_.refs.Date)
    $(_.refs.Date.getDOMNode())
      .datetimepicker({format: 'YYYY-MM-DD'})
      .on('dp.change', function(e){
        _.setState({date: e.target.value});
      });
  },
  clearNewForm: function(){
    this.replaceState({});
  },
  add: function(){
    var _ = this;
    var $save = $(_.refs.add.getDOMNode());
    var state = this.state;

    state.id = undefined;
    state.amount = Number(state.amount);
    $save.button('loading');

    api.expenses.insert(state)
      .done(function(){
          _.clearNewForm();
      })
      .always(function(){
        $save.button('reset');
      });
  },
  render: function(){
    var _ = this;
    var state = this.state;

    return (<tbody>
      <tr className="expense-add hidden-print">
        <td className="col-xs-1"><div className="btn-group hidden-print" role="group">
          <button type="button" onClick={_.clearNewForm} className="btn btn-default btn-xs"><span className="glyphicon glyphicon-remove"></span></button>
          <button type="button" className="btn btn-default btn-xs" disabled><span className="glyphicon glyphicon-pencil"></span></button>
          <button type="button" onClick={_.add} ref="add" data-loading-text="…" className="btn btn-default btn-xs"><span className="glyphicon glyphicon-plus"></span></button>
        </div></td>
        <td className="col-xs-2 date-td"><input type="text" className="form-control" placeholder="Date" valueLink={_.linkState('date')} ref="Date" /></td>
        <td className="col-xs-1 time-td"><input type="text" className="form-control" placeholder="Time" valueLink={_.linkState('time')} ref="Time" /></td>
        <td className="col-xs-4"><input type="text" className="form-control" ref="Description" placeholder="Description" valueLink={_.linkState('description')} /></td>
        <td className="col-xs-2"><div className="input-group">
           <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
          <input type="number" className="form-control" placeholder="Amount" valueLink={_.linkState('amount')} />
        </div></td>
        <td className="col-xs-4"><input type="text" className="form-control" placeholder="Comment" value={state.comment} name="comment" ref="Comment" onChange={_.onChange}/></td>
      </tr>
    </tbody>);
  }
});


module.exports = NewExpense;

})(module, require, React, ReactIntl, jQuery, undefined, window);