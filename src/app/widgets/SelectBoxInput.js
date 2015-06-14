'use strict';

var React = require('react');
var Select = require('react-select');

var SelectBoxInput = React.createClass({
    render () {
        //init props with default values
        var workplace = this.props.workplace || false;
        var delimiter = this.props.delimiter || ",";
        var multi = this.props.multi || false;

        //one-way data binding
        var options = !workplace?(this.props.options || []):[];

        //two-way data binding
        var defaultValue = [];
        var valueModel = this.props.valueLink;
        if (valueModel === undefined) valueModel = {value:defaultValue};

        var selectedOptions = valueModel.value;
        var value = selectedOptions !== undefined && selectedOptions.length !==0 ? _.map(selectedOptions,function(opt){return opt.value}).join(delimiter):undefined

        var handleChange = function (newValue, selectedOptions) {
            valueModel.value = selectedOptions;
        };

        return (
            <div>
                <Select
                    delimiter={delimiter}
                    value={value}
                    options={options}
                    multi = {multi}
                    placeholder ={this.props.placeholder}
                    onChange={handleChange}
                />
            </div>
        )
    }
});
module.exports = SelectBoxInput;
