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
import context         from './utils/context.react'
import Reflux          from 'reflux'
import Actions         from './actions/actions.react'
import UserStore       from './stores/user.react'

//@context
class ExpensesApp extends React.Component {

  constructor(props, context){
    context = $.extend(context, resources);

    super(props, context);

    const user = UserStore.getState();

    this.state = {
      user: user,
      list: []
    };
  }

  componentDidMount () {
    this.registerEvents();
  }

  componentWillUnmount() {
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
  }

  getExpenses() {
    Actions.expensesLoad();
  }

  registerEvents() {

    this.unsubscribes = [
      Actions.signIn.completed.listen(this.logIn.bind(this)),
      Actions.register.completed.listen(this.logIn.bind(this)),
      Actions.logOut.listen(this.logOut.bind(this)),
      Actions.expensesLoad.completed.listen(this.update.bind(this)),
      Actions.expenseUpdate.completed.listen(this.update.bind(this)),
      Actions.expenseInsert.completed.listen(this.update.bind(this)),
      Actions.expenseDelete.completed.listen(this.update.bind(this)),
      Actions.expensesLoad.failed.listen(this.determinateActionOnError.bind(this)),
      Actions.expenseUpdate.failed.listen(this.determinateActionOnError.bind(this)),
      Actions.expenseInsert.failed.listen(this.determinateActionOnError.bind(this)),
      Actions.expenseDelete.failed.listen(this.determinateActionOnError.bind(this)),
      Actions.expensesLoad.failed.listen(() => this.update([]))
    ];
  }

  update(expenses) {
    this.setState({list: expenses});
  }

  determinateActionOnError(data) {
    data && data.message === 'token not provided' && Actions.logOut(data);
    data && data.message === 'invalid token' && Actions.logOut(data);
    data && data.message === 'token expired' && Actions.logOut(data);
  }

  logOut () {
    this.setState({user: false, list: []});
  }

  logIn (user) {
    this.setState({user: user});

    this.getExpenses();
  }

  render () {

    if(!this.state.user) {
      return (<Login {...this.props}/>);
    }

    return (<RouteHandler {...this.props} {...this.state}/>);
  }

  _onChange () {
    this.setState(this.state);
  }

  getChildContext () {
    return $.extend({}, this.context, resources);
  }
}
ExpensesApp.displayName = 'ExpensesApp';

context(ExpensesApp);

//window.onload = function(){

  const routes = (
    <Route name="app" path="/" handler={ExpensesApp}>
      <Route name="expenses" path="/expenses/groupBy/:groupBy" handler={Expenses} />
      <Route name="login" path="/login" handler={Login} />
      <DefaultRoute handler={Expenses}/>
      <NotFoundRoute handler={Expenses}/>
    </Route>
  );

  ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler, state) {
      const params = state.params;
      React.render(<Handler params={params} />, document.getElementById('expense-app'));
  });

  // module && module.hot && module.hot.addStatusHandler(function (eventName) {
    // console && console.log(eventName, arguments);
  // });

  // if (module.hot) {
    // require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
      // getRootInstances: function () {
        // // Help React Hot Loader figure out the root component instances on the page:
        // return [rootInstance];
      // }
    // });
  // }
//};
