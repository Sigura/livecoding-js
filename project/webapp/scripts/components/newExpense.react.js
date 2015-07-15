'use strict';

import React           from 'react'
import objectAssign    from 'object-assign'
import api             from '../store/api.react'
import AppDispatcher   from '../dispatcher/dispatcher.react'
import extensions      from '../utils/extensions.react'
import actions         from '../constants/actions.react'

export default class NewExpense extends React.Component {

    constructor(props, context){

        super(props, context);

        this.refs = {};
        this.state = this.props.expense || {};
    }

    componentDidMount() {
        this.registerEvents();
        this.buildComponents();
    }

    handleChange(e){
        var update = {};

        update[e.target.name] = e.target.value;
        this.setState(update);
    }

    componentWillUnmount() {
        this.listener && AppDispatcher.unregister(this.listener);
    }

    handleFluxEvents(action) {

        switch(action.actionType)
        {
            case actions.copyToNewExpense:
                this.fill(action.data);
            break;
        }
    }

    registerEvents() {

        this.listener = this.handleFluxEvents && AppDispatcher.register((action) => this.handleFluxEvents(action));
    }

    fill(expense){
        var _ = this;
        _.setState(expense);
        $(_.refs.Time.getDOMNode()).timepicker('setTime', expense.time);
        $(_.refs.Date.getDOMNode()).data('DateTimePicker').date(new Date(expense.date));
    }

    buildComponents(){

        if(this.refs.Time) {
            $(this.refs.Time.getDOMNode())
                .timepicker({
                    minuteStep: 10,
                    appendWidgetTo: 'body',
                    showMeridian: false,
                    defaultTime: 'current'
                }).on('changeTime.timepicker', e => this.setState({time: e.target.value}));
        }
        if(this.refs.Date) {
            $(this.refs.Date.getDOMNode())
                .datetimepicker({format: 'YYYY-MM-DD'})
                .on('dp.change', e => this.setState({date: e.target.value}));
        }
    }

    clearNewForm(){
        this.setState({
            date: null,
            time: null,
            amount: null,
            description: null,
            comment: null
        });
    }

    add(){
        var _ = this;
        var $save = $(_.refs.add.getDOMNode());
        var state = this.state;

        state.id = undefined;
        state.amount = Number(state.amount);
        $save.button('loading');

        api.expenses.insert(state)
            .always(() => $save.button('reset'))
            .done(() => this.clearNewForm());
    }

    render(){
        var _ = this;
        var state = this.state;

        return (<tbody>
            <tr className="expense-add hidden-print">
                <td className="col-xs-1"><div className="btn-group hidden-print" role="group">
                    <button type="button" onClick={_.clearNewForm.bind(this)} className="btn btn-default btn-xs"><span className="glyphicon glyphicon-remove"></span></button>
                    <button type="button" className="btn btn-default btn-xs" disabled><span className="glyphicon glyphicon-pencil"></span></button>
                    <button type="button" onClick={_.add.bind(this)} ref="add" data-loading-text="…" className="btn btn-default btn-xs"><span className="glyphicon glyphicon-plus"></span></button>
                </div></td>
                <td className="col-xs-2 date-td"><input type="text" className="form-control" placeholder="Date" valueLink={_.valueLinkBuilder('date')} ref="Date" /></td>
                <td className="col-xs-1 time-td"><input type="text" className="form-control" placeholder="Time" valueLink={_.valueLinkBuilder('time')} ref="Time" /></td>
                <td className="col-xs-4"><input type="text" className="form-control" ref="Description" placeholder="Description" valueLink={_.valueLinkBuilder('description')} /></td>
                <td className="col-xs-2"><div className="input-group">
                     <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
                    <input type="number" className="form-control" placeholder="Amount" valueLink={_.valueLinkBuilder('amount')} />
                </div></td>
                <td className="col-xs-4"><input type="text" className="form-control" placeholder="Comment" value={state.comment} name="comment" ref="Comment" onChange={_.handleChange.bind(this)}/></td>
            </tr>
        </tbody>);
    }

}

objectAssign(NewExpense.prototype, extensions);

