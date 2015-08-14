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
        this.props.onRequestHide();
    },

    render: function () {
        var keys = [];
        for (var i = 0; i !== localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        ;
        var tiles = keys.map(function (key) {
            return (
                <Tile onClick={this.ok} eventKey={key}>{key}</Tile>
            )
        }, this);

        return (
            <Modal bsStyle="primary" title="Load document" animation={false}>
                <div className="modal-body">
                    <div>
                        {tiles}
                    </div>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.ok}>OK</Button>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = LoadDialog;
