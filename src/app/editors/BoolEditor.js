var React = require('react');

var BoolEditor = React.createClass({
    //getInitialState:function(){
    //    return {
    //        value:this.props.value
    //    }
    //},
    render: function () {
        var checked = this.props.value?true:false;
        return (
            <input type='checkbox' checked={checked} onChange={this.props.onChange} />
        )
    }
});
module.exports = BoolEditor;
