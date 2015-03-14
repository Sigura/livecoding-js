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

/*
$.ajax('/api/users', {
    dataType: 'json',
    contentType: 'application/json',
    method: 'PUT',
    data: JSON.stringify({
        name: 'user',
        password: 'test'
    }),
    error: function(res) {
        console.log(res.responseJSON);
    },
    success: function(res) {
        console.log(res);
    }
})
.always(function(){

$.ajax('/api/users', {
    dataType: 'json',
    contentType: 'application/json',
    method: 'POST',
    data: JSON.stringify({
        name: 'user',
        password: 'test'
    }),
    error: function(res) {
        console.log(res.responseJSON);
    },
    success: function(res) {
        console.log(res);
    }
}).done(function(data){
   

    var token = data.token;

    
    $.ajax('/api/expenses?token=' + token, {
        dataType: 'json',
        contentType: 'application/json',
        method: 'DELETE',
        data: JSON.stringify({
            id: 1,
        }),
        error: function(res) {
            console.log(res.responseJSON);
        },
        success: function(res) {
            console.log(res);
        }
    });
    
    $.ajax('/api/expenses?token=' + token, {
        dataType: 'json',
        contentType: 'application/json',
        method: 'PUT',
        data: JSON.stringify({
            date: '2015-03-07',
            time: '23:08',
            description: 'expense description',
            amount: 125,
            comment: 'comment node',
        }),
        error: function(res) {
            console.log(res.responseJSON);
        },
        success: function(res) {
            console.log(res);
        }
    }).then(function(expense){

        return $.ajax('/api/expenses?token=' + token, {
            dataType: 'json',
            contentType: 'application/json',
            method: 'POST',
            data: JSON.stringify(expense),
            error: function(res) {
                console.log(res.responseJSON);
            },
            success: function(res) {
                console.log(res);
            }
        });
    
    }).then(function(expense){

        $.ajax('/api/expenses?token=' + token, {
            dataType: 'json',
            contentType: 'application/json',
            method: 'DELETE',
            data: JSON.stringify({
                id: expense.id,
            }),
            error: function(res) {
                console.log(res.responseJSON);
            },
            success: function(res) {
                console.log(res);
            }
        });

    });

    $.ajax('/api/expenses?token=' + token, {
        dataType: 'json',
        contentType: 'application/json',
        method: 'GET',
        error: function(res) {
            console.log(res.responseJSON);
        },
        success: function(res) {
            console.log(res);
        }
    });



});
   
});
*/

})(jQuery, JSON, React);