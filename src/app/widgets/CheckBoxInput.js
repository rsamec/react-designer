'use strict';

var React = require('react');

var CheckBoxInput = React.createClass({
    render: function () {
        return (
            <label>
                <input type="checkbox"  checked={this.props.value} />
                {this.props.label}
            </label>
        )
    }
});
module.exports = CheckBoxInput;
