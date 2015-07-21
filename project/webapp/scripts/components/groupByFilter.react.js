'use strict';

const React           = require('react');
const extensions      = require('../utils/extensions.react');
/*eslint-disable no-unused-vars*/
const {Link}          = require('react-router');
/*eslint-enable no-unused-vars*/

export default
//@extensions
class GroupByFilter extends React.Component {

    constructor(props, context){

        super(props, context);

        this.state = {};
    }

    render () {

        return (<div>
            <div className="panel panel-default hidden-print">
                <div className="panel-heading">Group by</div>
                <div className="panel-body">
                    <div className="btn-group" role="group">
                        <Link to="expenses" params={{groupBy: 'week'}} className="btn btn-default">by Week</Link>
                        <Link to="expenses" params={{groupBy: 'month'}} className="btn btn-default">by Month</Link>
                        <Link to="expenses" params={{groupBy: 'year'}}  className="btn btn-default">by Year</Link>
                        <Link to="expenses" params={{groupBy: 'all'}}  className="btn btn-default">Ungroup</Link>
                    </div>
                </div>
            </div>
        </div>);
    }

}

extensions(GroupByFilter);
