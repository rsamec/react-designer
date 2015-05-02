'use strict';

var React = require('react');
var styleFont = require('../styles/font');

var Flipper = React.createClass({
    getInitialState: function() {
        return {
            flipped: false
        };
    },
    flip: function() {
        this.setState({ flipped: !this.state.flipped });
    },
    render: function() {
        var fontStyle = styleFont(this.props.font);
        var style = {};
        if (this.props.width !== undefined) style['width'] = this.props.width;
        if (this.props.height !== undefined) style['height'] = this.props.height;

        var frontStyle = _.clone(fontStyle);
        if (this.props.frontColor !== undefined) frontStyle['backgroundColor'] = this.props.frontColor;

        var backStyle = _.clone(fontStyle);
        if (this.props.backColor !== undefined) backStyle['backgroundColor'] = this.props.backColor;

        return <div style={style} className={"flipper-container " + this.props.orientation} onClick={this.flip}>
            <div className={"flipper" + (this.state.flipped ? " flipped" : "")}>
                <Front style={frontStyle}>{this.props.front}</Front>
                <Back  style={backStyle}>{this.props.back}</Back>
            </div>
        </div>;
    }
});

var Front = React.createClass({
    render: function() {
        return <div className="front tile" style={this.props.style}>{this.props.children}</div>;
    }
});

var Back = React.createClass({
    render: function() {
        return <div className="back tile" style={this.props.style}>{this.props.children}</div>;
    }
});

module.exports = Flipper;
