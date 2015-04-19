'use strict';

var React = require('react');

var HtmlRenderer = React.createClass({
    render: function () {
        //experimental - columnCount
        var columnCountStyle = {};
        if (this.props.columnCount !== undefined) columnCountStyle.WebkitColumnCount=this.props.columnCount;

        return (
            <div style={columnCountStyle}>
                <div  dangerouslySetInnerHTML={{__html: this.props.content}}></div>
            </div>
        );
    }
});
module.exports = HtmlRenderer;
