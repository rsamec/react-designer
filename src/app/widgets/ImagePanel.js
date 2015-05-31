'use strict';

var React = require('react');

var ImagePanel = React.createClass({

    render: function () {
        var DEFAULT_MARGIN = 5;
        var style = {padding:DEFAULT_MARGIN};
        if (this.props.roundCorner) style = {webkitBorderRadius: 5, mozBorderRadius: 5, borderRadius: 5};
        if (!!this.props.borderWidth){
            style.borderStyle = "solid";
            style.borderColor = "black";
            style.borderWidth = this.props.borderWidth;
        }
        if (this.props.style.height !== undefined) style.height = this.props.style.height;
        if (this.props.style.width !== undefined) style.width = this.props.style.width;
        if (this.props.bgColor !== undefined) style.backgroundColor = this.props.bgColor;
        if (this.props.color !== undefined) style.color = this.props.color;
        if (this.props.padding !== undefined) style.padding = this.props.padding;

        var pStyle = {};
        var float = this.props.imageAlign === "topRight" || this.props.imageAlign === "bottomRight" ? "right" : "left";
        var bottom = this.props.imageAlign === "bottomLeft" || this.props.imageAlign === "bottomRight" ? true : false;

        var imgStyle = {float: float, clear: float, margin: DEFAULT_MARGIN};
        if (!!!this.props.imageWidth && !!!this.props.imageHeight){
            imgStyle.height = '50%'
        };
        if (!!this.props.imageWidth) imgStyle.width = this.props.imageWidth;
        if (!!this.props.imageHeight) imgStyle.height = this.props.imageHeight;
        if (!!this.props.imageMargin) imgStyle.margin = this.props.imageMargin;
        if (!!this.props.imageRadius) {
            imgStyle.webkitBorderRadius = this.props.imageRadius+ "%";
            imgStyle.mozBorderRadius = this.props.imageRadius+ "%";
            imgStyle.borderRadius = this.props.imageRadius + "%";
        }

        var spacerStyle = {height: 0};
        if (bottom) {
            spacerStyle = {float: float, width: 0};

            var imgHeight = this.props.imageHeight;
            if (this.props.style.height !== undefined) {
                if (imgHeight === undefined) imgHeight = parseInt(this.props.style.height / 2,10);

                // equal to the height of the content minus the height of the image and minus some margin.
                spacerStyle.height = (this.props.style.height - imgHeight) - (this.props.imageMargin!==undefined?this.props.imageMargin:DEFAULT_MARGIN);
            }
        }
        return (
            <div style={style}>
                <div style={spacerStyle}></div>
                <img src={this.props.imageUrl} style={imgStyle} />
                <div style={pStyle} dangerouslySetInnerHTML={{__html: this.props.content}}></div>
            </div>)
    }
});
module.exports = ImagePanel;
