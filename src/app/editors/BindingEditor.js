'use strict';

var React = require('react');

var BindingEditor = React.createClass({
    statics:{
        format(value) {
            if (value === undefined) return undefined;
            return _.isObject(value)?value.Path:value;
        },
        parse(value){
            if (value === undefined) return {};
            if (value === "") return {};
            return {Path:value};
        }
    },
    handleChange(e){
        var wrapEvent = {
            stopPropagation:function(){},
            target:{value:BindingEditor.parse(e.target.value)}
        }
        this.props.onChange(wrapEvent);
    },
    render () {
        var value = BindingEditor.format(this.props.value);
        return (
            <div className="input-group">
                <span className="input-group-addon">=</span>
                <input className='editor' type='text' value={value} onChange={this.handleChange} />
            </div>
        )
    }
});
module.exports = BindingEditor;
