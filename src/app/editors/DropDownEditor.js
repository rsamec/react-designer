'use strict';

var React = require('react');

var DropDownEditor = React.createClass({
    handleChange: function(e) {
      this.props.onChange(e);
    },
    render: function () {
        var optionNodes = this.props.args.options.map(function (option) {
            return <option value={option.value}>{option.label}</option>;
        });
        return (
            <select value={this.props.value} onChange={this.handleChange}>
                {optionNodes}
            </select>
        )
    }
});
module.exports = DropDownEditor;
