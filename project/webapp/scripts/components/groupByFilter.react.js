'use strict';

import React           from 'react';
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

    groupByWeek(){
        AppDispatcher.dispatch({actionType: actions.groupChanged, data: {groupBy: groupBy.Week}});
        this.props.onGroupChanged(groupBy.Week);
    }

    groupByMonth(){
        AppDispatcher.dispatch({actionType: actions.groupChanged, data: {groupBy: groupBy.Month}});
        this.props.onGroupChanged(groupBy.Month);
    }

    groupByYear(){
        AppDispatcher.dispatch({actionType: actions.groupChanged, data: {groupBy: groupBy.Year}});
        this.props.onGroupChanged(groupBy.Year);
    }

    withoutGroup(){
        AppDispatcher.dispatch({actionType: actions.groupChanged, data: {groupBy: groupBy.All}});
        this.props.onGroupChanged(groupBy.All);
    }

    render(){
        let _ = this;
        let cx = _.classSet;

        return (<div>
            <div className="panel panel-default hidden-print">
                <div className="panel-heading">Group by</div>
                <div className="panel-body">
                    <div className="btn-group" role="group">
                        <button type="button" onClick={_.groupByWeek.bind(_)} className={cx({active: _.props.groupBy === groupBy.Week, btn: true, 'btn-default': true})}>by Week</button>
                        <button type="button" onClick={_.groupByMonth.bind(_)} className={cx({active: _.props.groupBy === groupBy.Month, btn: true, 'btn-default': true})}>by Month</button>
                        <button type="button" onClick={_.groupByYear.bind(_)} className={cx({active: _.props.groupBy === groupBy.Year, btn: true, 'btn-default': true})}>by Year</button>
                        <button type="button" onClick={_.withoutGroup.bind(_)} className={cx({active: _.props.groupBy === groupBy.All, btn: true, 'btn-default': true})}>Ungroup</button>
                    </div>
                </div>
            </div>
        </div>);
    }

}

objectAssign(GroupByFilter.prototype, extensions);
