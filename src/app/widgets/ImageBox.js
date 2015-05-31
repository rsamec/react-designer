'use strict';

var React = require('react');

var ImageBox = React.createClass({

    render: function () {
        var style = {};
        if (!!this.props.style.height) style.height = this.props.style.height;
        if (!!this.props.style.width) style.width = this.props.style.width;
        if (!!this.props.radius) {
            style.webkitBorderRadius = this.props.radius+ "%";
            style.mozBorderRadius = this.props.radius+ "%";
            style.borderRadius = this.props.radius + "%";
        }

        return (
            <img src={this.props.url} style={style} width={style.width} height={style.height} />
        )
    }
});
module.exports = ImageBox;
