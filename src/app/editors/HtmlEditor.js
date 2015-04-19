'use strict';

var React = require("react");
var tinymce = require('tinymce');

var Bootstrap = require('react-bootstrap');
var Modal = Bootstrap.Modal;
var ModalTrigger = Bootstrap.ModalTrigger;
var Button = Bootstrap.Button;


var genUnique = (function () {
    var count = 0;
    return function () {
        return 'id' + count++;
    }
})();
var HtmlEditorDialog = React.createClass({
    render: function() {
        return (
            <Modal bsStyle="primary" title="Html editor" animation={false}>
                <div className="modal-body">
                    <TinyMceEditor content={this.props.content} onChange={this.props.handleChange} />
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});
var TinyMceEditor = React.createClass({
    getDefaultProps: function () {
        return {
            id: genUnique()
        }
    },
    getInitialState:function() {
        return {init:false};
    },
    tinyMceInstance:function(){
        var props = this.props;
        tinymce.baseURL = "./bower_components/tinymce/";
        tinymce.init({
            selector: "#"+ this.props.id,
            menubar: false,
            plugins: ["link","code"],
            target_list: [],
            resize: false,
            height: 300,
            toolbar: "undo redo | bold italic underline | link | cut copy paste | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code | styleselect,formatselect,fontsizeselect",
            setup: function(editor) {
                editor.on('change', function(e) {
                    props.onChange(editor.getContent({format : 'raw'}));
                });
                editor.on('loadContent', function(e) {
                    editor.setContent(props.content,{format : 'raw'});
                });
            },
            style_formats: [
                {title: 'Bold text', inline: 'b'},
                {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
                {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
                {title: 'Two column', block: 'div', styles: {'-webkit-column-count': '2'}},
                {title: 'Three column', block: 'div', styles: {'-webkit-column-count': '3'}},
                {title: 'Example 1', inline: 'span', classes: 'example1'},
                {title: 'Example 2', inline: 'span', classes: 'example2'},
                {title: 'Table styles'},
                {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
            ]
        });
    },
    componentDidMount: function () {
        tinymce.execCommand('mceRemoveEditor',true, this.props.id);
        this.tinyMceInstance();
    },
    render: function () {

        return (
            <textarea id={this.props.id} ref="text" />
        );
    }
});
var HtmlEditor = React.createClass({
    handleChange:function(content){
        var wrapEvent = {
            stopPropagation:function(){},
            target:{value:content}
        }
        this.props.onChange(wrapEvent);
    },
    render: function () {
        return (
            <table>
                <tr>
                    <td>
                        <input value={this.props.value} onChange={this.props.onChange}/>
                    </td>
                    <td>
                        <ModalTrigger modal={<HtmlEditorDialog content={this.props.value} handleChange={this.handleChange} />}>
                            <button type="button" className="btn btn-primary">
                                <span className="glyphicon glyphicon-fullscreen"></span>
                            </button>
                        </ModalTrigger>
                    </td>
                </tr>
            </table>
        )
    }
});
module.exports = HtmlEditor;
