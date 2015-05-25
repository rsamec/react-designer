'use strict';

var React = require('react');
var _ = require('underscore');

var SVGComponent = React.createClass({
    render() {
        return <svg {...this.props}>{this.props.children}</svg>
    }
});

var Rectangle = React.createClass({
    render() {
        return(
        <SVGComponent height={this.props.style.height} width={this.props.style.width}>
            <rect {...this.props}>{this.props.children}</rect>
        </SVGComponent>)
    }
});

var Circle = React.createClass({
    render() {
        return(
        <SVGComponent height={this.props.style.height} width={this.props.style.width}>
            <circle {...this.props}>{this.props.children}</circle>
        </SVGComponent>)
    }
});

var Ellipse = React.createClass({
    render() {
        return(
        <SVGComponent height={this.props.style.height} width={this.props.style.width}>
            <ellipse {...this.props}>{this.props.children}</ellipse>
        </SVGComponent>)

    }
});

var Line = React.createClass({
    render() {
        return(
        <SVGComponent height={this.props.style.height} width={this.props.style.width}>
            <line {...this.props}>{this.props.children}</line>
        </SVGComponent>)
    }
});

var Polyline = React.createClass({
    render() {
        return(
        <SVGComponent height={this.props.style.height} width={this.props.style.width}>
            <polyline {...this.props}>{this.props.children}</polyline>
        </SVGComponent>)
    }
});

var CornerLine = React.createClass({
    render() {

        var size = this.props.size || 150;
        var cornerWidth = this.props.width || 50;

        var height = _.max[this.props.style.height,size];
        var width = _.max[this.props.style.width,size];

        var max = size;
        var min = 0;
        var diff = max - cornerWidth;

        var up = this.props.up?true:false;

        var point = up?[[max,min],[min,max],[min,diff],[diff,min],[max,min]]:[[max,max],[min,min],[cornerWidth,min],[max,diff],[max,max]];
        var points = _.reduce(point,function(memo,num){return memo + " " + num[0] + "," + num[1];},"");

        var text = this.props.text;

        var x = this.props.x || max;
        var y = this.props.y || max;

        var rotate = up?315:45;
        var transform = "rotate(" + rotate.toString() + ")";

        return(
            <SVGComponent height={size} width={size}>
                <polyline points={points} {...this.props}></polyline>
                <text x={x} y={y} transform={transform}>{this.props.text}</text>
            </SVGComponent>)
    }
});

var CornerBox = React.createClass({
    render() {

        var type =  this.props.orientation;
        var up = (type === 'topLeft' || type === 'bottomRight')?true:false;
//        var right = (type === 'topRight' || type == 'bottomRight')?true:false;

        var size = this.props.size;
        var cornerWidth = this.props.width;
        if (type === 'bottomLeft' || type === 'bottomRight') cornerWidth = -1 * cornerWidth;

        var offset = 20;
        var x = offset;
        var y = -1*(cornerWidth / 2)

        if (up) {
            x = -1*(cornerWidth / 2);
            y = size - offset;
        }
        var text = this.props.text;


        return(<CornerLine {...this.props} size={this.props.size} width={cornerWidth} text={this.props.text}  x={x} y={y} up={up} />)
    }
});

var Shapes = {
    SVGComponent: SVGComponent,
    Rectangle: Rectangle,
    Circle: Circle,
    Ellipse: Ellipse,
    Line: Line,
    Polyline: Polyline,
    CornerLine:CornerLine,
    CornerBox:CornerBox
}

module.exports = Shapes;
