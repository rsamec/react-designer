//'use strict';

var React = require('react');
var ChartistGraphComponent = require('react-chartist');

var ChartistGraph = React.createClass({
    render() {
        var data = this.props.dataBinder === undefined?this.props.data:this.props.dataBinder.getValue(this.props.data.Path);

        return (
            <ChartistGraphComponent {...this.props} data={data} />
        )
    }
});
module.exports = ChartistGraph;
