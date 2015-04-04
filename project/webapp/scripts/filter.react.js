+((module, require, $, moment) => {
'use strict';

let React           = require('react'),
    extensions      = require('./extensions.react'),
    objectAssign    = require('object-assign'),
    actions         = require('./actions.react'),
    AppDispatcher   = require('./dispatcher.react');

class Filter extends React.Component {

    //mixins: [React.addons.LinkedStateMixin, IntlMixin],
    constructor(props, context){

        super(props, context);

        this.state = {};
        this.refs = {};
    }

    onChange(e){
        var state = this.state;
        
        state[e.target.name] = e.target.value;
        
        this.setState(state);

        //AppDispatcher.dispatch({actionType:actions.expenseFiltered, data: this.state});
        this.props.onFilterChanged && this.props.onFilterChanged(this.state);
    }

    registerEvents(){

        AppDispatcher.register((action) => {

            switch(action.actionType)
            {
                case actions.copyToNewExpense:
                    //_.fill(action.data);
                    break;
            }
        });
        
    }

    componentDidMount() {

        this.registerEvents();
        this.buildComponents();
    }

    buildComponents() {

        if(this.refs.dateFrom)
            $(this.refs.dateFrom.getDOMNode().parentNode)
                .datetimepicker({format: 'YYYY-MM-DD'})
                .on('dp.change', e => {
                    this.onChange({target:this.refs.dateFrom.getDOMNode()});
                });
        if(this.refs.dateTo)
            $(this.refs.dateTo.getDOMNode().parentNode)
                .datetimepicker({format: 'YYYY-MM-DD'})
                .on('dp.change', e => {
                    this.onChange({target:this.refs.dateTo.getDOMNode()});
                });
    }

    clear () {
        var state = {dateFrom:'',dateTo:'',amountFrom:'',amountTo:''};
        this.setState(state);
        this.props.onFilterChanged && this.props.onFilterChanged(state);
    }

    render () {
        var _ = this;
        var state = _.state;
        var cx = _.classSet;

        return (<div className={cx({'hidden-print': !(state.dateFrom || state.dateTo || state.amountFrom || state.amountTo)})}>
            <div className="panel panel-default">
                <div className="panel-heading hidden-print"><button className="btn btn-default btn-sm pull-right" onClick={_.clear.bind(_)}>Clear</button><span>Filter by</span></div>
                <div className="panel-body">
                <div className="row">
                    <div className={cx({'hidden-print': !state.dateFrom, 'form-group': true, 'date-from': true, 'col-md-5': true})}>
                        <label htmlFor="date-from">From date</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="dateFrom" ref="dateFrom" value={_.state.dateFrom} id="date-from" onChange={_.onChange.bind(_)} />
                            <span className="input-group-addon"><span className="glyphicon glyphicon-calendar"></span></span>
                        </div>
                    </div>
                    <div className={cx({'hidden-print': !state.amountFrom, 'form-group': true, 'amount-from': true, 'col-md-4': true})}>
                        <label htmlFor="amount-from">More then</label>
                        <div className="input-group">
                            <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
                            <input type="text" className="form-control" name="amountFrom" ref="amountFrom" value={_.state.amountFrom} id="amount-from" onChange={_.onChange.bind(_)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className={cx({'hidden-print': !state.dateTo, 'form-group': true, 'date-to': true, 'col-md-5': true})}>
                        <label htmlFor="date-to">To date</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="dateTo" ref="dateTo" id="date-to" value={_.state.dateTo} onChange={_.onChange.bind(_)} />
                            <span className="input-group-addon"><span className="glyphicon glyphicon-calendar"></span></span>
                        </div>
                    </div>
                    <div className={cx({'hidden-print': !state.amountTo, 'form-group': true, 'amount-to': true, 'col-md-4': true})}>
                        <label htmlFor="amount-to">Less then</label>
                        <div className="input-group">
                            <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
                            <input type="text" className="form-control" name="amountTo" ref="amountTo" id="amount-to" value={_.state.amountTo} onChange={_.onChange.bind(_)} />
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>);
    }
}

objectAssign(Filter.prototype, extensions);

module.exports = Filter;

})(module, require, jQuery, moment);