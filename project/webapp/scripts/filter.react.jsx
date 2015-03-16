+(function(module, require, React, $, moment, ReactIntl){
'use strict';

var IntlMixin       = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var actions = require('./actions.react');
var AppDispatcher = require('./dispatcher.react');

var Filter = module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin, IntlMixin],
    getInitialState: function() {
        return {};
    },
    onChange: function(e){
        var _ = this;
        var state = _.state;
        
        state[e.target.name] = e.target.value;
        
        _.setState(state);

        //AppDispatcher.dispatch({actionType:actions.expenseFiltered, data: _.state});
        _.props.onFilterChanged && _.props.onFilterChanged(_.state);
    },
    componentDidUpdate: function(prevProps, prevState){
        var _ = this;        
    },
    componentDidMount: function() {
        var _ = this;

        AppDispatcher.register(function(action){

            switch(action.actionType)
            {
                case actions.copyToNewExpense:
                    //_.fill(action.data);
                    break;
            }
        });

        _.buildComponents();
    },
    buildComponents: function(){
        var _ = this;

        if(_.refs.dateFrom)
            $(_.refs.dateFrom.getDOMNode().parentNode)
                .datetimepicker({format: 'YYYY-MM-DD'})
                .on('dp.change', function(e){
                    _.onChange({target:_.refs.dateFrom.getDOMNode()});
                });
        if(_.refs.dateTo)
            $(_.refs.dateTo.getDOMNode().parentNode)
                .datetimepicker({format: 'YYYY-MM-DD'})
                .on('dp.change', function(e){
                    _.onChange({target:_.refs.dateTo.getDOMNode()});
                });
    },
    clear: function () {
        this.replaceState({});
        this.props.onFilterChanged && this.props.onFilterChanged({});
    },
    render: function() {
        var _ = this;
        var state = _.state;
        var cx = React.addons.classSet;

        return (<div className={cx({'hidden-print': !(state.dateFrom || state.dateTo || state.amountFrom || state.amountTo)})}>
        <div className="panel panel-default">
            <div className="panel-heading"><button className="btn btn-default btn-sm pull-right" onClick={_.clear}>Clear</button><span>Filter by</span></div>
            <div className="panel-body">
            <div className="row">
                <div className={cx({'hidden-print': !state.dateFrom, 'form-group': true, 'date-from': true, 'col-md-5': true})}>
                    <label htmlFor="date-from">From date</label>
                    <div className="input-group">
                        <input type="text" className="form-control" name="dateFrom" ref="dateFrom" value={_.state.dateFrom} id="date-from" onChange={_.onChange} />
                        <span className="input-group-addon"><span className="glyphicon glyphicon-calendar"></span></span>
                    </div>
                </div>
                <div  className={cx({'hidden-print': !state.amountFrom, 'form-group': true, 'amount-from': true, 'col-md-4': true})}>
                    <label htmlFor="amount-from">More then</label>
                    <div className="input-group">
                        <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
                        <input type="text" className="form-control" name="amountFrom" ref="amountFrom" value={_.state.amountFrom} id="amount-from" onChange={_.onChange} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className={cx({'hidden-print': !state.dateTo, 'form-group': true, 'date-to': true, 'col-md-5': true})}>
                    <label htmlFor="date-to">To date</label>
                    <div className="input-group">
                        <input type="text" className="form-control" name="dateTo" ref="dateTo" id="date-to" value={_.state.dateTo} onChange={_.onChange} />
                        <span className="input-group-addon"><span className="glyphicon glyphicon-calendar"></span></span>
                    </div>
                </div>
                <div className={cx({'hidden-print': !state.amountTo, 'form-group': true, 'amount-to': true, 'col-md-4': true})}>
                    <label htmlFor="amount-to">Less then</label>
                    <div className="input-group">
                        <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
                        <input type="text" className="form-control" name="amountTo" ref="amountTo" id="amount-to" value={_.state.amountTo} onChange={_.onChange} />
                    </div>
                </div>
            </div>
            </div>
        </div>
            
            
        </div>);
    }
});

})(module, require, React, jQuery, moment, ReactIntl);