'use strict';

var React = require('react');

var Modal = React.createClass({
    killClick: function(e) {
        // clicks on the content shouldn't close the modal
        e.stopPropagation();
    },
    handleBackdropClick: function() {
        // when you click the background, the user is requesting that the modal gets closed.
        // note that the modal has no say over whether it actually gets closed. the owner of the
        // modal owns the state. this just "asks" to be closed.
        this.props.onRequestClose();
    },
    render: function() {
        return this.transferPropsTo(
            <div className="ModalBackdrop" onClick={this.handleBackdropClick}>
                <div className="ModalContent" onClick={this.killClick}>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = Modal;
