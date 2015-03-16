+(function($, JSON, React){
'use strict';

$().ready(function(){

    var ExpensesApp = require('./expensesApp.react');
    var resources = require('./resources.react');

    React.render(
        <ExpensesApp onLogin={this.loginHandler} locales={resources.locales} {...resources.messages} />,
        document.getElementById('expense-app')
    );

});

})(jQuery, JSON, React);