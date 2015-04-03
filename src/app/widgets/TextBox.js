var React = require('react');

var TextBox = React.createClass({

    render: function () {
        //var code = JSXTransformer.transform(
        //    '(function() {' +
        //    this.props.content +
        //    '\n})();',
        //    { harmony: true }
        //).code;
        //return React.createElement(eval(code));
        return (<span>{this.props.content}</span>);
    }
});
module.exports = TextBox;
