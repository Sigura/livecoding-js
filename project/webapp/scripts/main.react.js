/** @jsx React.DOM */
+(function($, JSON){
'use strict';

    let React = require('react'),
        ExpensesApp = require('./expensesApp.react');

    React.render(
        <ExpensesApp />,
        document.getElementById('expense-app')
    );

})(jQuery, JSON);