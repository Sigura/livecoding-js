'use strict';

import objectAssign    from 'object-assign';
import React           from 'react';
import ReactIntl       from 'react-intl';
import api             from '../store/api.react';
import resourceContext from '../utils/context.react';
import extensions      from '../utils/extensions.react';
import AppDispatcher   from '../dispatcher/dispatcher.react';
import actions         from '../constants/actions.react';

let IntlMixin       = ReactIntl.IntlMixin,
    L               = ReactIntl.FormattedMessage;

export default class Login extends React.Component {

    constructor(props, context){

        super(props, context);
        this.state = {};
    }

    componentDidMount() {

        AppDispatcher.register((action) => {

            switch(action.actionType)
            {
                case actions.sigIn:
                case actions.userRegistered:
                    this.updateState(action.data);
                break;
                case actions.loginFailed:
                case actions.registerFailed:
                    this.error(action.data);
                break;
            }
        });

    }

    updateState(res) {

        let state = this.state
        state.id = res.id;
        state.token = res.token;
        state.operationStart = false;
        this.setState(state);

        this.props.onLogin({id:state.id, name:state.name, token:state.token});
    }

    error(res) {

        var _ = this;
        var error = res && (res.responseJSON || res).error;
        var nameError = _.errorMessageByField(res, 'name');
        var passwordError = _.errorMessageByField(res, 'password');
        
        if(nameError || passwordError){
            _.state.errors = {
                name: nameError,
                password: passwordError
            }
        }
        _.state.error = typeof(error) === 'string' ? error : null;
        
        _.state.operationStart = false;

        console.info(_.state);
        
        _.setState(_.state);
    }
    
    signInHandler(event) {

        var _ = this;

        _.clearState();

        api.user.signIn(_.state);        
    }

    toggleButtons() {
        var _ = this;
        
        [_.refs.signInButton, _.refs.registerButton].each(
            (item) =>
                $(item.getDOMNode()).button(!_.state.operationStart    ? 'reset' : 'loading')
        );
    }

    errorMessageByField(res, name) {
        var errors = res && res.error && res.error.errors;
        
        if(!errors || !errors.length){
            //console.info(res);
            return;
        }

        var message = errors.filter((item) => item.param === name).shift();
        
        return message && message.msg;
    }

    clearState() {
        var _ = this;

        _.state.error = null;
        _.state.errors = null;
        _.state.operationStart = true;

        _.setState(this.state);
    }

    registerHandler(event) {
        var _ = this;

        _.clearState();

        api.user.register(_.state);
    }

    handleChange(event){
        this.state[event.target.name] = event.target.value.trim();
        
        this.setState(this.state);
    }
    
    renderError(error) {
        return error ? (
            <div className="alert alert-danger" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span className="sr-only">Error:</span>{error}
            </div>
        ) : null;
        
    }

    render() {
        let _ = this;
        let state = _.state;
        let error = _.renderError(state.error);
        let errorName = state.errors && _.renderError(state.errors.name);
        let errorPassword = state.errors && _.renderError(state.errors.password);
        let cx = _.classSet;
    
        return (
            <form className="form-signin">
                <div className="row"><h2 className="form-signin-heading col-md-12"><L message={_.l10n('LoginFormTitle')}/></h2></div>
                <div className="row">
                        <div className={cx({'col-md-12': true, 'form-group':true, 'has-success':state.errors && !state.errors.name, 'has-error': state.errors && state.errors.name})}><label htmlFor="email" className="sr-only">Email address</label>
                        <input type="text" name="email" className="form-control" placeholder="Name or email address" required autofocus valueLink={_.valueLinkBuilder('name')} /></div>
                </div>
                <div className="row"><div className={cx({'col-md-12': true, 'form-group':true, 'has-success':state.errors && !state.errors.password, 'has-error': state.errors && state.errors.password})}>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input type="password" className="form-control" placeholder="Password" required valueLink={_.valueLinkBuilder('password')} /></div></div>
                <div className="row">
                    <div className="error-list col-md-5">{error}{errorName}{errorPassword}</div>
                    <div className="col-md-7" role="group">
                            <div className="pull-right btn-group">
                                <button className="btn btn-lg btn-primary" onClick={_.signInHandler.bind(_)} type="button" data-loading-text="Wait response..." ref="signInButton">Sign in</button>
                                <button className="btn btn-lg pull-right" type="button" onClick={_.registerHandler.bind(_)} data-loading-text="Wait response..." ref="registerButton">Register</button>
                            </div></div>
                </div>
            </form>
        );
    }

}

resourceContext.extend(Login);

objectAssign(Login.prototype, extensions);