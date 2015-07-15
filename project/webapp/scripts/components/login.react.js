'use strict';

import objectAssign    from 'object-assign'
import api             from '../store/api.react'
import extensions      from '../utils/extensions.react'
import AppDispatcher   from '../dispatcher/dispatcher.react'
import actions         from '../constants/actions.react'
import React           from 'react'
import ReactIntl       from 'react-intl'

export default class Login extends React.Component {

    constructor(props, context){

        super(props, context);

        this.state = {};
    }

    componentDidMount () {
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
            case actions.loginFailed:
            case actions.registerFailed:
                this.error(action.data);
            break;
        }

    }

    updateState(res) {

        let state = this.state;
        state.id = res.id;
        state.token = res.token;
        state.operationStart = false;

        this.setState(state);
    }

    error(res) {

        let _ = this;
        let error = res && (res.responseJSON || res).error;
        let nameError = _.errorMessageByField(res, 'name');
        let passwordError = _.errorMessageByField(res, 'password');

        if(nameError || passwordError){
            _.state.errors = {
                name: nameError,
                password: passwordError
            };
        }
        _.state.error = typeof error === 'string' ? error : null;

        _.state.operationStart = false;

        console.info(_.state);

        _.setState(_.state);
    }

    signInHandler(/*event*/) {

        this.clearState();

        api.user.signIn(this.state);
    }

    toggleButtons() {

        [this.refs.signInButton, this.refs.registerButton].each(
            (item) =>
                $(item.getDOMNode()).button(!this.state.operationStart    ? 'reset' : 'loading')
        );
    }

    errorMessageByField(res, name) {
        var errors = res && res.error && res.error.errors;

        if(!errors || !errors.length){
            //console.info(res);
            return '';
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

    registerHandler(/*event*/) {
        var _ = this;

        _.clearState();

        api.user.register(_.state);
    }

    handleChange(event){
        this.state[event.target.name] = event.target.value.trim();

        this.setState(this.state);
    }

    static renderError(error) {
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
        let error = Login.renderError(state.error);
        let errorName = state.errors && Login.renderError(state.errors.name);
        let errorPassword = state.errors && Login.renderError(state.errors.password);
        let cx = _.classSet;
        /*eslint-disable no-unused-vars*/
        let L = ReactIntl.FormattedMessage;
        /*eslint-enable no-unused-vars*/

        return (
            <form className="form-signin">
                <div className="row"><h2 className="form-signin-heading col-md-12"><L message={_.l10n('LoginFormTitle')}/></h2></div>
                <div className="row">
                        <div className={cx({'col-md-12': true, 'form-group': true, 'has-success': state.errors && !state.errors.name, 'has-error': state.errors && state.errors.name})}><label htmlFor="email" className="sr-only">Email address</label>
                        <input type="text" name="email" className="form-control" placeholder="Name or email address" required autofocus valueLink={_.valueLinkBuilder('name')} /></div>
                </div>
                <div className="row"><div className={cx({'col-md-12': true, 'form-group': true, 'has-success': state.errors && !state.errors.password, 'has-error': state.errors && state.errors.password})}>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input type="password" name="password" className="form-control" placeholder="Password" required valueLink={_.valueLinkBuilder('password')} /></div></div>
                <div className="row">
                    <div className="error-list col-md-5"><L message={_.l10n('Error')} error={error} errorName={errorName} errorPassword={errorPassword} /></div>
                    <div className="col-md-7" role="group">
                            <div className="pull-right btn-group">
                                <button className="btn btn-lg btn-primary signIn-button" onClick={_.signInHandler.bind(_)} type="button" data-loading-text="Wait response..." ref="signInButton">Sign in</button>
                                <button className="btn btn-lg pull-right register-button" type="button" onClick={_.registerHandler.bind(_)} data-loading-text="Wait response..." ref="registerButton">Register</button>
                            </div></div>
                </div>
            </form>
        );
    }

}

Login.contextTypes = {
  router: React.PropTypes.func,
  locales: React.PropTypes.string,
  messages: React.PropTypes.object,
  formats: React.PropTypes.object,
  lang: React.PropTypes.string
};

Login.displayName = 'Login';

objectAssign(Login.prototype, extensions);
