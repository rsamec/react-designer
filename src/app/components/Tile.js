'use strict';

var React = require('react');

var Tile = React.createClass({
    handleClick:function(e){
        this.props.onClick(this.props.eventKey);
    },
    render: function () {

        return (<div className="Tile" onClick={this.handleClick}>{this.props.children}</div>);
    }
})

module.exports = Tile;
