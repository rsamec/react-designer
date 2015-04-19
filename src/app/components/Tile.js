'use strict';

var React = require('react');

var Tile = React.createClass({

    render: function () {

        return (<div className="Tile">{this.props.children}</div>);
    }
})

module.exports = Tile;
