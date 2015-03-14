+(function(module, require, ReactIntl){
'use strict';

var Login = require('./login.react');
var Expenses = require('./expenses.react');
var IntlMixin = ReactIntl.IntlMixin;
var actions = require('./actions.react');
var AppDispatcher = require('./dispatcher.react');

var ExpensesApp = React.createClass({
    mixins: [IntlMixin],

    getInitialState: function() {
        return {user: false};//{user: {id: 1, token: 'edede25a-7573-4be2-b471-c2fa5b8bfa44', name: 'adudnik@gmail.com'}};
    },

    componentDidMount: function() {
    },

    componentWillUnmount: function() {
    },
    loginHandler: function(user){
      
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

})(module, require, ReactIntl);