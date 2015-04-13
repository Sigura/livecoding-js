'use strict';

import objectAssign    from 'object-assign';
import Login           from './login.react';
import Expenses        from './expenses.react';
import AppDispatcher   from '../dispatcher/dispatcher.react';
import resourceContext from '../utils/context.react';
import extensions      from '../utils/extensions.react';
import actions         from '../constants/actions.react';
import resources       from '../constants/resources.react';

export default class Alerts extends React.Component {
    constructor (props, context) {

        super(props, context);

        this.state = Alerts.getInitState();
        this.registerEvents();
    }

    static getInitState () {
        return {alerts: []};
    }

    componentDidMount () {

        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
        this.listener && AppDispatcher.unregister(this.listener);
    }

    registerEvents() {

        this.listener = this.handleFluxEvents && AppDispatcher.register((action) => this.handleFluxEvents(action));
    }

    handleFluxEvents(action) {
        switch (action.actionType) {
            case actions.expensesLoadError:
            case actions.expenseInsertError:
            case actions.expenseUpdateError:
            case actions.expenseDeleteError:
                this.addErrors(action.data);
            break;
            case actions.expenseDeleted:
            case actions.expensesLoaded:
            case actions.expenseInserted:
                this.addAlert(action.actionType);
            break;

        }
    }

    setupRemoveTimer (error) {
        setTimeout(() => {
            let index = this.state.alerts.indexOf(error);

            if (index === -1) {
                return;
            }

            this.state.alerts.splice(index, 1);
            this.mounted && this.setState({alerts: this.state.alerts});
        }, 5000);
    }

    addErrors (data) {
        data && data.error && this.addAlert(data.error.message || data.error, true);

        data && data.error && lodash.uniq(data.error.errors || [], 'msg')
            .forEach((item) => {
                this.addAlert(/*item.param + ':' + */item.msg, true);
            });
    }

    addAlert (text, isError) {
        let alert = {
                text: this.l10n(text) || text,
                error: !!isError
            };
        this.state.alerts.push(alert);
        this.mounted && this.setState({alerts: this.state.alerts});
        this.setupRemoveTimer(alert);
    }

    render () {

        let _ = this;
        let cx = _.classSet;
        let state = this.state;

        return (<div className={cx({'col-sm-4': true, 'float-right': true, 'hidden-print': true, 'list-group': true, 'col-sm-6': true, 'hide-element': !state.alerts.length})}>
            {state.alerts.map(function(item, i){
              return <div key={'alert-item-' + i} className={cx({'list-group-item': true, 'list-group-item-success': !item.error, 'list-group-item-danger': item.error})} role="alert">{item.text}</div>;
            })}
          </div>);
    }

}

resourceContext.extend(Alerts);

objectAssign(Alerts.prototype, extensions);
