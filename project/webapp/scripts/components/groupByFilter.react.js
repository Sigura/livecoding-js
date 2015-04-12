'use strict';

//import React           from 'react';
import objectAssign    from 'object-assign';
import extensions      from '../utils/extensions.react';
import groupBy         from '../constants/groupBy.react';
import actions         from '../constants/actions.react';
import AppDispatcher   from '../dispatcher/dispatcher.react';

export default class GroupByFilter extends React.Component {

    constructor(props, context){

        super(props, context);

        this.state = {};
    }

    static render () {
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
