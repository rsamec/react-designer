var React = require('react');

var ValueBox = React.createClass({


    render: function () {
        var content = !!this.props.content?this.props.content:this.props.emptyValue;
        var style = !!this.props.content?{ 'border-bottom': '1px dashed #999','font-weight':'bold'}:{};
        return (
            <span style={style}>{content}</span>
        )
    }
});
module.exports = ValueBox;
