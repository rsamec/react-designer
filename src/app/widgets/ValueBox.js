'use strict';

var React = require('react');
var styleFont = require('../styles/font');

var ValueBox = React.createClass({
    render: function () {

        var content = !!this.props.content?this.props.content:this.props.emptyValue;

        return (
            <span style={styleFont(this.props.font)}>{content}</span>
        )
    }
});
module.exports = ValueBox;
