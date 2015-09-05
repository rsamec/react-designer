import React from 'react';
import {Modal,Button} from 'react-bootstrap';

import Tile from '../components/Tile.js';

var LoadDialog = React.createClass({
    getInitialState: function () {
        return {storageKey: this.props.storageKey};
    },
    onChange: function (e) {
        this.setState({storageKey: e});
    },
    ok: function (e) {
        this.props.confirm(e);
        this.props.onHide();
    },

    render: function () {
        var keys = [];
        for (var i = 0; i !== localStorage.length; i++) {
            keys.push(localStorage.key(i));
        };
        var tiles = keys.map(function (key) {
            return (
                <Tile onClick={this.ok} eventKey={key}>{key}</Tile>
            )
        }, this);

        return (
            <Modal {...this.props}  bsStyle="primary" animation={false}>
                <Modal.Header>
                    <Modal.Title>Load document</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {tiles}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
});

module.exports = LoadDialog;
