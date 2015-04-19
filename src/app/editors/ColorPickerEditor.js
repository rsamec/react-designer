'use strict';

var React = require('react');
var ColorPicker = require('react-color-picker');

//bootstrap
var Bootstrap = require('react-bootstrap');
var Modal = Bootstrap.Modal;
var ModalTrigger = Bootstrap.ModalTrigger;
var Button = Bootstrap.Button;

var ColorPickerDialog = React.createClass({
     render: function() {
        return (
            <Modal bsStyle="primary" title="Color picker" animation={false}>
                <div className="modal-body">
                    <ColorPicker value={this.props.color} onChange={this.props.handleChange} />
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});
var ColorPickerEditor = React.createClass({
    handleChange:function(color){
        var wrapEvent = {
            stopPropagation:function(){},
            target:{value:color}
        }
        this.props.onChange(wrapEvent);
    },
    render: function () {
        var color = this.props.value === undefined?"#000000":this.props.value;
        return (
                <table>
                    <tr>
                        <td>
                            <div style={{background: color, width: 100, height: 40, color: 'white'}}>
                            {color}
                            </div>
                        </td>
                        <td>
                            <ModalTrigger modal={<ColorPickerDialog color={color} handleChange={this.handleChange} />}>
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
module.exports = ColorPickerEditor;
