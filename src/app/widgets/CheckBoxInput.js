var React = require('react');

var CheckBoxInput = React.createClass({
    render: function () {
        //var valueModel = this.props.model;
        //var handleChange = function (e) {
        //    valueModel.value = e.target.checked;
        //}

        return (
            <label>
                <input type="checkbox"  checked={this.props.value} />
                {this.props.label}
            </label>
        )
    }
});
module.exports = CheckBoxInput;
