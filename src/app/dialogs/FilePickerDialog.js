import React from 'react';
//import {Modal} from 'react-overlays';
//import ModalStyles from '../styles/ModalStyles.js';
import {Modal,Button} from 'react-bootstrap';

var FilePickerDialog = React.createClass({
    getInitialState: function () {
        return {
            storageKey: this.props.storageKey
        };
    },
    onChange: function (e) {

        var files = e.target.files; // FileList object

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {

            var parts = f.name.split(".");
            var fileName = parts[0];
            // Only process image files.
            if (parts[1] != 'json') {
                continue;
            }

            var reader = new FileReader();

            var self = this;
            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var objectSchema = JSON.parse(e.target.result);

                    self.setState({
                        storageKey: fileName,
                        objectSchema: objectSchema
                    });
                };
            })(f);
            // Read in the file as a data URL.
            reader.readAsText(f);
        }


    },
    ok: function (e) {
        if (this.state.objectSchema !== undefined) this.props.confirm(this.state.objectSchema, this.state.storageKey);
        this.props.onRequestHide();
    },
    render: function () {
        return (
            <Modal bsStyle="primary" title="File picker document" animation={false}>
                <div className="modal-body">
                    <input type="file" onChange={this.onChange}/>


                </div>
                <div className="modal-footer">
                    <Button onClick={this.ok}>OK</Button>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});

module.exports = FilePickerDialog;
