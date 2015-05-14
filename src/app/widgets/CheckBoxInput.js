'use strict';

var React = require('react');

var CheckBoxInput = React.createClass({
    render: function () {
        var valueModel = this.props.valueLink;
        var value = this.props.valueLink?valueModel.value:this.props.DefaultValue;
        var handleChange = function (e) {
            valueModel.value = e.target.checked?true:false;
        };
        return (
            <label>
                <input type="checkbox"  checked={value} onChange={handleChange} />
                {this.props.label}
            </label>
        )
    }
});
module.exports = CheckBoxInput;
