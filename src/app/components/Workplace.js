import React from 'react';
import BindToMixin from 'react-binding';
import _ from 'lodash';

var Container = require('./Container');

var Workplace = React.createClass({
    mixins: [BindToMixin],
    getInitialState(){
        return {data: _.cloneDeep(this.props.schema.props.defaultData)}
    },
    componentWillReceiveProps: function (newProps) {
        if (this.props.schema.props.defaultData !== newProps.schema.props.defaultData) {
            this.setState({data: _.cloneDeep(newProps.schema.props.defaultData)});
        }
    },
    render: function () {
        var handleClick = function () {
            if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.schema);
        }.bind(this);

        //var empty = this.props.schema.containers.length == 0;
        var dataContext = this.bindToState('data');

        var component =
            <Container
                containers={this.props.schema.containers}
                boxes={this.props.schema.boxes}
                currentChanged={this.props.currentChanged}
                current={this.props.current}
                handleClick={handleClick}
                isRoot={true}
                dataBinder={dataContext}
                intlData={this.props.schema.intlData}
                />

        return ( <div className="cWorkplace">{component}</div>);
    }
});

module.exports = Workplace;
