'use strict';

import React           from 'react';
import ReactIntl       from 'react-intl';
import Login           from './login.react';
import Expenses        from './expenses.react';
import AppDispatcher   from '../dispatcher/dispatcher.react';
import resourceContext from '../utils/context.react';
import actions         from '../constants/actions.react';
let IntlMixin          = ReactIntl.IntlMixin;

export default class ExpensesApp extends React.Component {
    constructor(props, context){
        //debugger;
        super(props, context);
        this.state = {user: false};
    }

    getState() {
        return this.state || {};
    }

    componentDidMount () {
        this.registerEvents();
        this.loadStoredData();
    }
    
    registerEvents () {

        AppDispatcher.register((action) => {

            switch(action.actionType)
            {
                case actions.logOut:
                    this.logOut(action.data);
                break;
                case actions.expenseDeleteError:
                case actions.expenseUpdateError:
                case actions.expensesLoadError:
                case actions.expenseInsertError:
                    this.determinateActionOnError(action.data);
                break;
            }
        });        
    }

    determinateActionOnError(data) {
        data && data.error === 'invalid token' && this.logOut(data);
        data && data.error === 'token expired' && this.logOut(data);
    }
    
    loadStoredData () {
        
        let user;
        try{
            user = localStorage.user && JSON.parse(localStorage.user);
        }catch(e){}
        
        if(user && user.token) {
            AppDispatcher.dispatch({actionType: actions.signIn, data: user});

            this.setState({user: user});
        }
    }

    logOut () {
        delete localStorage.user;
        
        location.reload(true);
    }

    loginHandler (user) {
        localStorage.user = JSON.stringify(user);

        this.setState({user: user});
    }

    render () {

        let state = this.getState();
    
        if(!state.user)
           return (<Login onLogin={this.loginHandler.bind(this)} />);
        
        return (<Expenses />);
    }

    _onChange () {
        this.setState(this.state);
    }

}

//resourceContext.extend(ExpensesApp);
