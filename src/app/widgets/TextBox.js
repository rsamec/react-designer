'use strict';

var React = require('react');
var styleFont = require('../styles/font');

var TextBox = React.createClass({

    render: function () {

        //var code = JSXTransformer.transform(
        //    '(function() {' +
        //    this.props.content +
        //    '\n})();',
        //    { harmony: true }
        //).code;
        //return React.createElement(eval(code));

        return (<span style={styleFont(this.props.font)}>{this.props.content}</span>);
    }
});
module.exports = TextBox;
