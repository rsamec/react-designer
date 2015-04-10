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
        var font = this.props.font;
        var style = {};
        if (font !== undefined) {
            if (font.size !== undefined) style['font-size'] = font.size;
            if (font.color !== undefined) style['color'] = font.color;
            if (font.bold) style['font-weight'] = 'bold';
            if (font.italic) style['font-style'] = 'italic';
            if (font.underline) style['border-bottom'] = '1px solid black';

        }
        return (<span style={style}>{this.props.content}</span>);
    }
});
module.exports = TextBox;
