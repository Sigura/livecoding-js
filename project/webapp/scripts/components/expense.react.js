'use strict';

import objectAssign       from 'object-assign';
import api                from '../store/api.react';
import AppDispatcher      from '../dispatcher/dispatcher.react';
import resourceContext    from '../utils/context.react';
import extensions         from '../utils/extensions.react';
import actions            from '../constants/actions.react';
import groupBy            from '../constants/groupBy.react';

export default class Expense extends React.Component {

    constructor (props, context) {
        super(props, context);
        this.state = {edit: false};
        this.props.expense = this.props.expense || {};
    }

    componentDidMount () {
        this.setState(this.props.expense || {});
        this.buildComponents();
    }

    componentDidUpdate (/*prevProps, prevState*/) {
        this.buildComponents();
    }

    buildComponents () {

        if (this.refs.Time) {
            $(this.refs.Time.getDOMNode())
                .timepicker({
                    minuteStep: 10,
                    appendWidgetTo: 'body',
                    showMeridian: false,
                    defaultTime: 'current'
                }).on('changeTime.timepicker', (e) => this.setState({time: e.target.value}));
        }

        if(this.refs.Date) {
            $(this.refs.Date.getDOMNode())
                .datetimepicker({format: 'YYYY-MM-DD'})
                .on('dp.change', (e) => this.setState({date: e.target.value}));
        }
    }

    startEdit () {
        this.setState({edit: true});
    }

    stopEdit () {
        this.setState({edit: false});
    }

    cancelEdit () {
        this.stopEdit();
        this.setState(this.props.expense || {});
    }

    save () {
        var state = this.state;
        var $save = $(this.refs.save.getDOMNode());

	state.amount = Number(state.amount);
        $save.prop('disabled', true);

        api.expenses.update(state)
            .done(data => {
                this.props.expense = data;
                this.stopEdit();
            })
            .always(() => $save.prop('disabled', false));
    }

    remove () {
        var state = this.state;
        var $save = $(this.refs.remove.getDOMNode());

	state.amount = Number(state.amount);
        $save.button('loading');
        api.expenses.delete(state)
            .always(() => $save.button('reset'));
    }

    handleChange (e) {
        var update = {};

        update[e.target.name] = e.target.value;
        this.setState(update);
    }

    copyToNewExpense () {
        AppDispatcher.dispatch({actionType: actions.copyToNewExpense, data: this.state});
    }

    render () {
        let _ = this;
        let state = _.state;
        let cx = _.classSet;
        /*eslint-disable no-unused-vars*/
        let FormattedNumber = ReactIntl.FormattedNumber;
        /*eslint-enable no-unused-vars*/

        return (
            <tr className={cx({'expense-row': true, 'expense-edit': state.edit})} onDoubleClick={_.startEdit.bind(this)}>
                <td>
                <div className="btn-group hidden-print" role="group">
                    <button type="button" className="btn btn-default btn-xs" onClick={_.remove.bind(_)} data-loading-text="…" ref="remove"><span className="glyphicon glyphicon-remove"></span></button>
                    {!state.edit
                        ? <button type="button" className="btn btn-default btn-xs" onClick={_.startEdit.bind(_)}><span className="glyphicon glyphicon-pencil"></span></button>
                        : <button type="button" className="btn btn-default btn-xs" onClick={_.cancelEdit.bind(_)}><span className="glyphicon glyphicon-floppy-remove"></span></button>
                    }
                    {!state.edit
                        ? <button type="button" className="btn btn-default btn-xs" onClick={_.copyToNewExpense.bind(_)}><span className="glyphicon glyphicon-copy"></span></button>
                        : <button type="button" className="btn btn-default btn-xs" onClick={_.save.bind(_)} data-loading-text="…" ref="save"><span className="glyphicon glyphicon-floppy-disk"></span></button>
                    }
                </div>
                </td>
                <td className="col-xs-2 date-td">{state.edit && <input type="text" className="form-control hidden-print" placeholder="Date" ref="Date" valueLink={_.valueLinkBuilder('date')} />}<span className={cx({'visible-print-inline': state.edit, 'date-value': true})}>{state.date}</span></td>
                <td className="col-xs-1 time-td">{state.edit && <input type="text" className="form-control hidden-print" placeholder="Time" ref="Time" valueLink={_.valueLinkBuilder('time')} />}<span className={cx({'visible-print-inline': state.edit, 'time-value': true})}>{state.time}</span></td>
                <td>{state.edit && <input type="text" className="form-control hidden-print" placeholder="Description" ref="Description" valueLink={_.valueLinkBuilder('description')} />}<span className={cx({'visible-print-inline': state.edit, 'description-value': true})}>{state.description}</span></td>
                <td className="amount-td">{state.edit && <div className="input-group hidden-print">
                         <span className="input-group-addon"><span className="glyphicon glyphicon-usd"></span></span>
                        <input type="number" className="form-control" placeholder="Amount" valueLink={_.valueLinkBuilder('amount')} />
                    </div>}<span className={cx({'visible-print-inline': state.edit, 'amount-value': true})}><FormattedNumber value={state.amount || 0} format="USD" /></span></td>
                <td>{state.edit && <input type="text" className="form-control hidden-print" placeholder="Comment" valueLink={_.valueLinkBuilder('comment')} />}<span className={cx({'visible-print-inline': state.edit, 'amount-value': true})}>{state.comment}</span></td>
            </tr>
        );
    }
}

objectAssign(Expense.prototype, extensions);
