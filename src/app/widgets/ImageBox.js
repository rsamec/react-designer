'use strict';

var React = require('react');

var ImageBox = React.createClass({

    render: function () {
        var style = {};
        if (this.props.height!==undefined) style.height = this.props.height;
        if (this.props.width!==undefined) style.width = this.props.width;
        return (
            <img src={this.props.url} style={style} width={style.width} height={style.height} />
        )
    }
});
module.exports = ImageBox;
