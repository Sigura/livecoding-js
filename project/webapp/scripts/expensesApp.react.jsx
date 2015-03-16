+(function(module, require, ReactIntl, $, localStorage, undefined){
'use strict';

var Login = require('./login.react');
var Expenses = require('./expenses.react');
var IntlMixin = ReactIntl.IntlMixin;
var actions = require('./actions.react');
var AppDispatcher = require('./dispatcher.react');

var ExpensesApp = React.createClass({
    mixins: [IntlMixin],

    getInitialState: function() {
        return {user: false};
    },

    componentDidMount: function() {
        var _ = this;

        _.registerEvents();
        _.loadStoredData();
    },
    
    registerEvents: function () {
        var _ = this;

        AppDispatcher.register(function(action) {

          switch(action.actionType)
          {
            case actions.logOut:
              _.logOut(action.data);
            break;
          }
        });        
    },

    loadStoredData: function () {
        
        var user, _ = this;
        try{
            user = localStorage.user && JSON.parse(localStorage.user);
        }catch(e){}
        
        if(user && user.token) {
            AppDispatcher.dispatch({actionType: actions.signIn, data: user});

            _.setState({user: user});
        }
    },
    logOut: function () {
        delete localStorage.user;
        
        location.reload(true);
    },
    componentWillUnmount: function() {
    },
    loginHandler: function(user) {
        localStorage.user = JSON.stringify(user);

        this.setState({user: user});
    },
    render: function() {

        var state = this.state;
    
        if(!state.user)
           return (<Login onLogin={this.loginHandler} />);
        
        return (<Expenses />);
    },

    _onChange: function() {
        this.setState(this.state);
    }

});

module.exports = ExpensesApp;

})(module, require, ReactIntl, jQuery, localStorage, undefined);