var React = require("react");
var ModalTrigger = require('react-bootstrap').ModalTrigger;

var HtmlRenderer = React.createClass({
    getDefaultProps: function () {
        return { id: "editor1111"}
    },
    createModal:function(){
        return React.createElement(this.props.tinyMceEditor,this.props);
    },
    render: function () {
        return (
            <ModalTrigger modal={this.createModal()}>
                <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
            </ModalTrigger>
        );
    }
});
module.exports = HtmlRenderer;
