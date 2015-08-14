import React from 'react';
import {Modal,Button} from 'react-bootstrap';

var SaveAsDialog = React.createClass({
    getInitialState: function () {
        return {storageKey: this.props.storageKey};
    },
    onChange: function (e) {
        this.setState({storageKey: e.target.value});
    },
    ok: function (e) {
        this.props.confirm(this.state.storageKey);
        this.props.onRequestHide();
    },

    render: function () {
        return (
            <Modal bsStyle="primary" title="Rename document" animation={false}>
                <div className="modal-body">
                    <input type="text" value={this.state.storageKey} onChange={this.onChange}/>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.ok}>OK</Button>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = SaveAsDialog;
