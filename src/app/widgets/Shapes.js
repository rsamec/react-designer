'use strict';

var React = require('react')

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

var Shapes = {
    SVGComponent: SVGComponent,
    Rectangle: Rectangle,
    Circle: Circle,
    Ellipse: Ellipse,
    Line: Line,
    Polyline: Polyline
}

module.exports = Shapes;
