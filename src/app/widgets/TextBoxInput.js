'use strict';

var React = require('react');

var TextBoxInput = React.createClass({
    render: function () {
        var valueModel = this.props.valueLink;
        var value = this.props.valueLink?valueModel.value:this.props.DefaultValue;
        var handleChange = function (e) {
            valueModel.value = e.target.value;
        };
        return (
            <label>{this.props.label}
                <input type='text' value={value} onChange={handleChange}/>
            </label>
        )
    }
});
module.exports = TextBoxInput;
