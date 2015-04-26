'use strict';

var React = require('react');

var BoolEditor = React.createClass({
  render: function () {
        var checked = this.props.value?true:false;
        return (
            <input className='editor' type='checkbox' checked={checked} onChange={this.props.onChange} />
        )
    }
});
module.exports = BoolEditor;
