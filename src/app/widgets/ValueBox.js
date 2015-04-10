var React = require('react');

var ValueBox = React.createClass({


    render: function () {
        var font = this.props.font;
        var style = {};
        if (font !== undefined) {
            if (font.size !== undefined) style['font-size'] = font.size;
            if (font.color !== undefined) style['color'] = font.color;
            if (font.bold) style['font-weight'] = 'bold';
            if (font.italic) style['font-style'] = 'italic';
            if (font.underline) style['border-bottom'] = '1px dashed #999';

        }
        var content = !!this.props.content?this.props.content:this.props.emptyValue;

        return (
            <span style={style}>{content}</span>
        )
    }
});
module.exports = ValueBox;
