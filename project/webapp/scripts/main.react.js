'strict mode';

import React           from 'react'
import ReactRouter, {
  RouteHandler,
  DefaultRoute,
  NotFoundRoute,
  Route
}                      from 'react-router'
import resources       from './constants/resources.react'
import Login           from './components/login.react'
import Expenses        from './components/expenses.react'
import AppDispatcher   from './dispatcher/dispatcher.react'
import actions         from './constants/actions.react'
import context         from './utils/context.react'

class ExpensesApp extends React.Component {

  constructor(props, context){
      context = $.extend(context, resources);

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
          case actions.signIn:
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

      if(!this.state.user) {
          return (<Login {...this.props}/>);
          //this.context.router.transitionTo('login');
      }

      return (<RouteHandler {...this.props}/>);
  }

  _onChange () {
      this.setState(this.state);
  }

  getChildContext () {
    return $.extend({}, this.context, resources);
  }
}

context.extend(ExpensesApp);
ExpensesApp.displayName = 'ExpensesApp';

window.onload = function(){

  const routes = (
    <Route name="app" path="/" handler={ExpensesApp}>
      <Route name="expenses" path="/expenses/groupBy/:groupBy" handler={Expenses} />
      <Route name="login" path="/login" handler={Login} />
      <DefaultRoute handler={Expenses}/>
      <NotFoundRoute handler={Expenses}/>
    </Route>
  );

  ReactRouter.run(routes, function (Handler, state) {
      const params = state.params;
      React.render(<Handler params={params} />, document.getElementById('expense-app'));
  });
  module.hot.addStatusHandler(function(){
    debugger;
  });
};

// if (module.hot) {
  // require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    // getRootInstances: function () {
      // // Help React Hot Loader figure out the root component instances on the page:
      // return [rootInstance];
    // }
  // });
// }
