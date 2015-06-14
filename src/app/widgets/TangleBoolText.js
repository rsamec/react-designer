var React = require('react');

var TangleBoolText = React.createClass({
    render(){

        //support for two-way data binding
        var valueModel = this.props.valueLink;
        var handleChange = function (e) {
            //toogle value
            if (valueModel === undefined) return;
            valueModel.value = !valueModel.value;
        };

        var trueComponent = this.props.trueComponent || React.createElement('span',null,this.props.trueText);
        var falseComponent = this.props.falseComponent || React.createElement('span',null,this.props.falseText);


        var component = valueModel !== undefined && valueModel.value?trueComponent:falseComponent;
        var className = this.props.className || 'tangle-text';
        //hard coded style
        var style = {display:'inline'};
        return (
            <div style={style} className={className} onClick={handleChange}>
                {component}
            </div>
        );
    }
})
module.exports = TangleBoolText;
