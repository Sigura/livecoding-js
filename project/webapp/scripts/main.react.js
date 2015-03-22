/** @jsx React.DOM */
+(function($, JSON, React){
'use strict';

//$().ready(function(){

    var resources = require('./resources.react');
    var ExpensesApp = require('./expensesApp.react');

    React.render(
        <ExpensesApp locales={resources.locales} {...resources.messages} />,
        document.getElementById('expense-app')
    );

//});

})(jQuery, JSON, React);