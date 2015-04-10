var React = require('react');

var NumberInputEditor = React.createClass({
    //getInitialState:function(){
    //    return {
    //        value:this.props.value
    //    }
    //},
    //handleChange:function(e){
    //    this.setState({value:e.target.value});
    //    this.props.onChange(e)
    //},
    render: function () {
        return (
               <input type='number' value={this.props.value} onChange={this.props.onChange} />
        )
    }
});
module.exports = NumberInputEditor;
