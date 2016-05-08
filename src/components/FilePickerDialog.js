import React from 'react';
import {Modal} from 'react-overlays';
import ModalStyles from './ModalStyles.js';

export default class FilePickerDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storageKey: this.props.storageKey,
      showModal: false
    };
  }

  onChange(e) {

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
  }

  ok(e) {
    if (this.state.objectSchema !== undefined) this.props.confirm(this.state.objectSchema, this.state.storageKey);
    this.props.onHide();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.ok.bind(this)} style={ModalStyles.modalStyle}
             backdropStyle={ModalStyles.backdropStyle}>
        <div style={ModalStyles.dialogStyle}>
          <input type="file" onChange={this.onChange.bind(this)}/>
        </div>
      </Modal>);
  }
};
