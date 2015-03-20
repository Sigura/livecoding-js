+(function(module, $, React, ReactIntl){
'use strict';

var IntlMixin       = ReactIntl.IntlMixin;
var actions = require('./actions.react');
var AppDispatcher = require('./dispatcher.react');
var api = require('./api.react');
var L = ReactIntl.FormattedMessage;

var Login = React.createClass({
  mixins: [React.addons.LinkedStateMixin, IntlMixin],
  
  getInitialState: function() {
    this.state = this.state || {};
    
    return this.state;
  },

  componentDidMount: function() {

    var _ = this;
  
    AppDispatcher.register(function(action) {

      switch(action.actionType)
      {
        case actions.sigIn:
        case actions.userRegistered:
          _.updateState(action.data);
        break;
        case actions.loginFailed:
        case actions.registerFailed:
          _.error(action.data);
        break;
      }
    });

  },

  l10n: function(messageName) {
    return this.getIntlMessage(messageName);
  },

  componentWillUnmount: function() {
  },

  stopPropagation: function(event) {
    event = event || window.event;

    event.stopPropagation && event.stopPropagation();
    event.preventDefault();

    event.cancelBubble = true

    //return false;
  },
  updateState: function(res) {
    var _ = this;

    _.state.id = res.id;
    _.state.token = res.token;
    _.state.operationStart = false;
    _.setState(_.state);

    _.props.onLogin({id:_.state.id, name:_.state.name, token:_.state.token});
  },
  error: function(res) {

    var _ = this;
    var error = (res.responseJSON || res).error;
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
  },
  signInHandler: function(event) {

    var _ = this;

    _.clearState();

    api.user.signIn(_.state);    
  },
  toggleButtons: function() {
    var _ = this;
    
    [_.refs.signInButton, _.refs.registerHandler].each(function(item)
    {
      $(item.getDOMNode()).button(!_.state.operationStart  ? 'reset' : 'loading');
    });
  },
  errorMessageByField: function(res, name) {
    var errors = res && res.error && res.error.errors;
    
    if(!errors || !errors.length){
      //console.info(res);
      return;
    }

    var message = errors.filter(function(item){
      return item.param === name;
    }).shift();
    
    return message && message.msg;
  },
  clearState: function() {
    var _ = this;

    _.state.error = null;
    _.state.errors = null;
    _.state.operationStart = true;

    _.setState(this.state);
  },
  registerHandler: function(event) {
    var _ = this;

    _.clearState();

    api.user.register(_.state);
  },
  handleChange: function(event){
    this.state[event.target.name] = event.target.value.trim();
    
    this.setState(this.state);
  },
  renderError: function(error) {
    return error ? (
      <div className="alert alert-danger" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span className="sr-only">Error:</span>{error}
      </div>
    ) : null;
    
  },
  render: function() {
    var _ = this;
    var state = _.state;
    var error = _.renderError(state.error);
    var errorName = state.errors && _.renderError(state.errors.name);
    var errorPassword = state.errors && _.renderError(state.errors.password);
    var cx = React.addons.classSet;
  
    return (
      <form className="form-signin" onSubmit={_.stopPropagation}>
        <h2 className="form-signin-heading"><L message={_.l10n('LoginFormTitle')}/></h2>
        <div className={cx({'form-group':true, 'has-success':state.errors && !state.errors.name, 'has-error': state.errors && state.errors.name})}><label htmlFor="email" className="sr-only">Email address</label>
          <input type="text" name="email" className="form-control" placeholder="Name or email address" required autofocus valueLink={_.linkState('name')} /></div>
        <div className={cx({'form-group':true, 'has-success':state.errors && !state.errors.password, 'has-error': state.errors && state.errors.password})}>
          <label htmlFor="password" className="sr-only">Password</label>
          <input type="password" className="form-control" placeholder="Password" required valueLink={_.linkState('password')} />
        </div>
        <div className="error-list">{error}{errorName}{errorPassword}</div>
        <button className="btn btn-lg btn-primary btn-block" onClick={_.signInHandler} type="submit" data-loading-text="Wait response..." ref="signInButton">Sign in</button>
        <button className="btn btn-lg btn-block" type="submit" onClick={_.registerHandler} data-loading-text="Wait response..." ref="registerButton">Register</button>
      </form>
    );
  }
});

module.exports = Login;

})(module, jQuery, React, ReactIntl);