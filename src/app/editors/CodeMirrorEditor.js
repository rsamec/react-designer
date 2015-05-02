'use strict';

var React = require('react');
var CodeMirror = require('react-code-mirror');
require('codemirror/mode/javascript/javascript');

//bootstrap
var Bootstrap = require('react-bootstrap');
var Modal = Bootstrap.Modal;
var ModalTrigger = Bootstrap.ModalTrigger;
var Button = Bootstrap.Button;

var CodeMirrorEditorDialog = React.createClass({
     getInitialState:function(){
       return  {
           value:this.props.value
       }
     },
     handleChange:function(e){
       this.setState({value:e.target.value})
     },
        ok:function(){
            this.props.handleChange(this.state.value);
            this.props.onRequestHide();
        },
     render: function() {
         var codeMirrorComponent = React.createElement(CodeMirror, {
             style: {border: '1px solid black'},
             textAreaClassName: ['form-control'],
             textAreaStyle: {minHeight: '10em'},
             value: this.state.value,
             mode: 'javascript',
             theme: 'solarized',
             lineNumbers: true,
             onChange: this.handleChange
         });
         return (
             <Modal bsStyle="primary" title="Javascript editor (code-mirror)" animation={false}>
                 <div className="modal-body">
                {codeMirrorComponent}
                 </div>
                 <div className="modal-footer">
                     <Button onClick={this.ok}>OK</Button>
                     <Button onClick={this.props.onRequestHide}>Close</Button>
                 </div>
             </Modal>
         );
     }
});
var CodeMirrorEditor = React.createClass({
    handleChange:function(value){
        var wrapEvent = {
            stopPropagation:function(){},
            target:{value:value}
        }
        this.props.onChange(wrapEvent);
    },
    render: function () {
        return (
                <table>
                    <tr>
                        <td>
                            {this.props.value}
                        </td>
                        <td>
                            <ModalTrigger modal={<CodeMirrorEditorDialog value={this.props.value} handleChange={this.handleChange} />}>
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
module.exports = CodeMirrorEditor;
