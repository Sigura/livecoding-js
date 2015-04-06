'use strict';

//import React           from 'react';
import Login           from './login.react';
import Expenses        from './expenses.react';
import AppDispatcher   from '../dispatcher/dispatcher.react';
import resourceContext from '../utils/context.react';
import actions         from '../constants/actions.react';

export default class ExpensesApp extends React.Component {
    constructor(props, context){
        super(props, context);

        this.state = {user: false};
    }

    getState() {
        return this.state || {};
    }

    componentDidMount () {
        this.loadStoredData();
        this.registerEvents();
    }

    componentWillUnmount() {
        this.listener && AppDispatcher.unregister(this.listener);
    }

    registerEvents() {

        this.listener = this.handleFluxEvents && AppDispatcher.register((action) => this.handleFluxEvents(action));
    }

    handleFluxEvents(action) {
        switch(action.actionType)
        {
            case actions.sigIn:
            case actions.userRegistered:
                this.logIn(action.data);
            break;
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
    }

    determinateActionOnError(data) {
        data && data.error === 'invalid token' && this.logOut(data);
        data && data.error === 'token expired' && this.logOut(data);
    }

    loadStoredData () {

        let user;
        try{
            user = localStorage.user && JSON.parse(localStorage.user);
        }catch(e){ window.console && console.log && console.log(e); }

        if(user && user.token) {
            AppDispatcher.dispatch({actionType: actions.signIn, data: user});

            this.setState({user: user});
        }
    }

    logOut () {
        delete localStorage.user;
        this.state.user = false;
        this.setState({user: false});

        //location.reload(true);
        //this.context.router.transitionTo('/login');
    }

    logIn (user) {
        localStorage.user = JSON.stringify(user);
        this.state.user = user;
        this.setState({user: user});
        //this.context.router.transitionTo('/');
    }

    render () {

        let state = this.state;
        /*eslint-disable no-unused-vars*/
        let RouteHandler = ReactRouter.RouteHandler;
        /*eslint-enable no-unused-vars*/

        if(!state.user) {
            return (<Login />);
        }

        return (<RouteHandler {...this.props}/>);
    }

    _onChange () {
        this.setState(this.state);
    }

}

ExpensesApp.contextTypes = {
  router: React.PropTypes.func
};
