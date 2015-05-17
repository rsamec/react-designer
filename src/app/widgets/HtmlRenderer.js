'use strict';

var React = require('react');

var HtmlRenderer = React.createClass({
    componentDidMount () {
        var el = this.getDOMNode();
    },
    render() {
        //experimental - columnCount, counterReset
        var style = {};
        if (this.props.columnCount !== undefined) style.WebkitColumnCount=this.props.columnCount;
        if (this.props.counterReset !== undefined) style.counterReset = 'item ' + (this.props.counterReset - 1);
        return (
            <div className="nestedList" style={style} dangerouslySetInnerHTML={{__html: this.props.content}}></div>
        );
    }
});
module.exports = HtmlRenderer;
