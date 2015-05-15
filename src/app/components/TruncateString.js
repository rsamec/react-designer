'use strict';

var React = require('react');

var TruncateString = React.createClass({
    render() {
        const n = 25;
        var s = this.props.value;
        var truncated = s.length > n ? s.substr(0, n - 1) + "..." : s;
        return (<span>{truncated}</span>);
    }
});

module.exports = TruncateString;
