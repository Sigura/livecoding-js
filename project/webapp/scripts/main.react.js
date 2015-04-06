'strict mode';

import React from       'react';
import Intl  from       'react-intl';
import ExpensesApp from './components/expensesApp.react';

React.render(
    <ExpensesApp />,
    document.getElementById('expense-app')
);
