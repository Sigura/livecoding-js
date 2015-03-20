+(function (require, module, $, JSON, React, ReactIntl, lodash) {
    'use strict';

    var Login = require('./login.react'),
        Expenses = require('./expenses.react'),
        IntlMixin = ReactIntl.IntlMixin,
        actions = require('./actions.react'),
        AppDispatcher = require('./dispatcher.react'),

        Alerts = React.createClass({
            mixins: [IntlMixin],

            getInitialState: function () {
                return {alerts: []};
            },

            l10n: function(messageName) {
                try{
                    return this.getIntlMessage(messageName);
                }catch(e){
                    return;
                }
            },

            componentDidMount: function () {
                var _ = this;

                AppDispatcher.register(function (action) {

                    switch (action.actionType) {
                        case actions.expensesLoadError:
                        case actions.expenseInsertError:
                        case actions.expenseUpdateError:
                        case actions.expenseDeleteError:
                            _.addErrors(action.data);
                        break;
                        case actions.expenseDeleted:
                        case actions.expensesLoaded:
                        case actions.expenseInserted:
                            _.addAlert(action.actionType);
                        break;

                    }
                });
            },

            setupRemoveTimer: function (error) {
                var _ = this;

                setTimeout(function () {
                    var index = _.state.alerts.indexOf(error);

                    if (index === -1) {
                        return;
                    }

                    _.state.alerts.splice(index, 1);
                    _.setState({alerts: _.state.alerts});
                }, 5000);
            },

            addErrors: function (data) {
                var _ = this;
                data.error && _.addAlert(data.error.message || data.error, true);

                data.error && lodash.uniq(data.error.errors|| [], 'msg')
                    .forEach(function (item) {
                        _.addAlert(/*item.param + ':' + */item.msg, true);
                    });
            },

            addAlert: function (text, isError) {
                var _ = this,
                    alert = {
                        text: _.l10n(text) || text ,
                        error: !!isError
                    };
                _.state.alerts.push(alert);
                _.setState({alerts: _.state.alerts});
                _.setupRemoveTimer(alert);
            },
            
            render: function () {

                var _ = this;
                var cx = React.addons.classSet;
                var state = this.state;

                return (<div className={cx({'col-sm-4': true, 'float-right': true, 'hidden-print':true, 'list-group':true, 'col-sm-6':true, 'hide-element': !state.alerts.length})}>
                    {state.alerts.map(function(item, i){
                      return <div key={'alert-item-' + i} className={cx({'list-group-item':true, 'list-group-item-success':!item.error, 'list-group-item-danger':item.error})} role="alert">{item.text}</div>;
                    })}
                  </div>);
            },

        });

    module.exports = Alerts;

})(require, module, jQuery, JSON, React, ReactIntl, _);