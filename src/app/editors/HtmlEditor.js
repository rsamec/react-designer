'use strict';

var React = require("react");
var TinyMCE = require('react-tinymce');

var Bootstrap = require('react-bootstrap');
var Modal = Bootstrap.Modal;
var ModalTrigger = Bootstrap.ModalTrigger;
var Button = Bootstrap.Button;

var HtmlEditorDialog = React.createClass({
    getInitialState:function(){
      return {
          content:this.props.content
      }
    },
    handleEditorChange: function (e) {
        this.setState({content:e.target.getContent()})
    },
    confirm:function(){
        this.props.handleChange(this.state.content);
        this.props.onRequestHide();
    },
    render: function() {
        return (
            <Modal bsStyle="primary" title="Html editor" animation={false}>
                <div className="modal-body">
                    <TinyMCE
                        content={this.props.content}
                        config={{
                            menubar: false,
                            height:300,
                            plugins: 'autolink link image lists code',
                            toolbar: 'bold italic underline | link | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code'
                        }}
                        onChange={this.handleEditorChange}
                    />

                </div>
                <div className="modal-footer">
                    <Button onClick={this.confirm}>OK</Button>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
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
                        <input className='editor' value={this.props.value} onChange={this.props.onChange}/>
                    </td>
                    <td>
                        <ModalTrigger modal={<HtmlEditorDialog content={this.props.value} handleChange={this.handleChange} />}>
                            <button type="button" className="btn btn-primary btn-xs" >
                                <span className="glyphicon glyphicon-option-horizontal"></span>
                            </button>
                        </ModalTrigger>
                    </td>
                </tr>
            </table>
        )
    }
});
module.exports = HtmlEditor;
