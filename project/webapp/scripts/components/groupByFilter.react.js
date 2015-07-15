'use strict';

const React           = require('react');
const ReactRouter     = require('react-router');
const objectAssign    = require('object-assign');
const extensions      = require('../utils/extensions.react');

class GroupByFilter extends React.Component {

    constructor(props, context){

        super(props, context);

        this.state = {};
    }

    render () {
        /*eslint-disable no-unused-vars*/
        let Link = ReactRouter.Link;
        /*eslint-enable no-unused-vars*/

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

objectAssign(GroupByFilter.prototype, extensions);

module.exports = GroupByFilter;
