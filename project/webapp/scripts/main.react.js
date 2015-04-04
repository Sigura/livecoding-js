/** @jsx React.DOM */
+(function($, JSON){
'use strict';

    var React = require('react');
    var ExpensesApp = require('./expensesApp.react');

    React.render(
        <ExpensesApp />,
        document.getElementById('expense-app')
    );

})(jQuery, JSON);