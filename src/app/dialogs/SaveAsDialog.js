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
        this.props.onHide();
    },

    render: function () {
        return (
            <Modal {...this.props}  bsStyle="primary" title="Rename document" animation={false}>
                <Modal.Header>
                    <Modal.Title>Rename document</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <input type="text" value={this.state.storageKey} onChange={this.onChange}/>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.ok}>OK</Button>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = SaveAsDialog;
