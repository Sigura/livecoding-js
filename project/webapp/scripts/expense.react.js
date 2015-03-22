+(function(module, require, React, ReactIntl, $, undefined, window){
'use strict';

var IntlMixin       = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var api = require('./api.react');
var AppDispatcher   = require('./dispatcher.react');
var actions = require('./actions.react');
var groupBy         = require('./groupBy.react');

var Expense = React.createClass({
  mixins: [React.addons.LinkedStateMixin, IntlMixin],
  getInitialState: function(){
    return {edit: false};
  },
  componentDidMount: function(){
    var _ = this;

    _.setState(_.props.expense || {});
    _.buildComponents();
  },
  componentDidUpdate: function(prevProps, prevState){
    this.buildComponents();
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
  startEdit: function(){
    this.setState({edit: true});
  },
  stopEdit: function(){
    this.setState({edit: false});
  },
  cancelEdit: function(){
    this.stopEdit();
    this.setState(this.props.expense);
  },
  save: function() {
    var _ = this;
    var state = _.state;
    var $save = $(_.refs.save.getDOMNode());
    state.amount = Number(state.amount);
    $save.prop('disabled', true);
    
    api.expenses.update(state)
      .done(function(){
        _.stopEdit();
      })
      .always(function(){
        $save.prop('disabled', false);
      });
  },
  remove: function(){
    var _ = this;
    var state = _.state;
    var $save = $(_.refs.remove.getDOMNode());
    state.amount = Number(state.amount);
    $save.button('loading');
    
    api.expenses.delete(state)
      .always(function(){
        $save.button('reset');
      });
  },
  copyToNewExpense: function() {
    AppDispatcher.dispatch({actionType: actions.copyToNewExpense, data:this.state});
  },
  render: function() {
    var _ = this;
    var state = _.state;
    var cx = React.addons.classSet;

    return (
      <tr className={cx({'expense-row': true, 'expense-edit': state.edit})} onDoubleClick={_.startEdit}>
        <td>
        <div className="btn-group hidden-print" role="group">
          <button type="button" className="btn btn-default btn-xs" onClick={_.remove} data-loading-text="…" ref="remove"><span className="glyphicon glyphicon-remove"></span></button>
          {!state.edit
            ? <button type="button" className="btn btn-default btn-xs" onClick={_.startEdit}><span className="glyphicon glyphicon-pencil"></span></button>
            : <button type="button" className="btn btn-default btn-xs" onClick={_.cancelEdit}><span className="glyphicon glyphicon-floppy-remove"></span></button>
          }
          {!state.edit
            ? <button type="button" className="btn btn-default btn-xs" onClick={_.copyToNewExpense}><span className="glyphicon glyphicon-copy"></span></button>
            : <button type="button" className="btn btn-default btn-xs" onClick={_.save} data-loading-text="…" ref="save"><span className="glyphicon glyphicon-floppy-disk"></span></button>
          }
        </div>
        </td>
        <td className="col-xs-2 date-td">{state.edit && <input type="text" className="form-control hidden-print" placeholder="Date" ref="Date" valueLink={_.linkState('date')} />}<span className={cx({'visible-print-inline': state.edit,'date-value': true})}>{state.date}</span></td>
        <td className="col-xs-1 time-td">{state.edit && <input type="text" className="form-control hidden-print" placeholder="Time" ref="Time" valueLink={_.linkState('time')} />}<span className={cx({'visible-print-inline': state.edit,'time-value': true})}>{state.time}</span></td>
        <td>{state.edit && <input type="text" className="form-control hidden-print" placeholder="Description" ref="Description" valueLink={_.linkState('description')} />}<span className={cx({'visible-print-inline': state.edit,'description-value': true})}>{state.description}</span></td>
        <td className="amount-td">{state.edit && <div className="input-group hidden-print">
             <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
            <input type="number" className="form-control" placeholder="Amount" valueLink={_.linkState('amount')} />
          </div>}<span className={cx({'visible-print-inline': state.edit,'amount-value': true})}><FormattedNumber value={state.amount || 0} format="USD" /></span></td>
        <td>{state.edit && <input type="text" className="form-control hidden-print" placeholder="Comment" valueLink={_.linkState('count')} />}<span className={cx({'visible-print-inline': state.edit,'amount-value': true})}>{state.comment}</span></td>
      </tr>
    );
  }
})


module.exports = Expense;

})(module, require, React, ReactIntl, jQuery, undefined, window);