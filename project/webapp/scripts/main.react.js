'strict mode';

import ExpensesApp from   './components/expensesApp.react';
import Login from         './components/login.react';
import Expenses from      './components/expenses.react';

/*eslint-disable no-unused-vars*/
let DefaultRoute = ReactRouter.DefaultRoute;
let Link = ReactRouter.Link;
let Route = ReactRouter.Route;
let RouteHandler = ReactRouter.RouteHandler;
let NotFoundRoute = ReactRouter.NotFoundRoute;

let routes = (
  <Route name="app" path="/" handler={ExpensesApp}>
    <Route name="expenses" path="/expenses/groupBy/:groupBy" handler={Expenses} />
    <DefaultRoute handler={Expenses}/>
    <NotFoundRoute handler={Expenses}/>
  </Route>
);

ReactRouter.run(routes, function (Handler, state) {
    let params = state.params;
    React.render(<Handler params={params}/>, document.getElementById('expense-app'));
});
/*eslint-enable no-unused-vars*/
