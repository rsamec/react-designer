'use strict';

var React = require('react');

var If = require('../components/If');

var BindingEditor = React.createClass({
    handleChange(e) {
        var path = React.findDOMNode(this.refs.pathInput).value;
        var converter = React.findDOMNode(this.refs.showConverters).checked ? React.findDOMNode(this.refs.converter).value : undefined;

        var binding = {Path: path, Converter: converter};
        if (this.props.args !== undefined) binding["Mode"] = this.props.args.bindingMode;

        var wrapEvent = {
            stopPropagation: function () {
            },
            target: {value: binding}
        }
        this.props.onChange(wrapEvent);
    },
    render() {
        var binding = this.props.value || {};
        var value = binding.Path;
        var style ={};
        if (binding.Converter === undefined) style = {display:'none'};
        return (
            <div className="input-group">
                <span className="input-group-addon">=</span>
                <input className='editor' ref="pathInput" type='text' value={value} onChange={this.handleChange} />
                <div className="input-group-addon">
                    <input type='checkbox' ref="showConverters" onChange={this.handleChange} />

                    <select style={style}  ref="converter"  onChange={this.handleChange}>
                        <option>Number</option>
                        <option>Date</option>
                    </select>

                </div>
            </div>
        )
    }
});
module.exports = BindingEditor;
