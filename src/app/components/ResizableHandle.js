'use strict';

var React = require('react'),
    ItemTypes = require('./ItemTypes'),
    PropTypes = React.PropTypes,
    DragDropMixin =require('react-dnd').DragDropMixin,
    DropEffects = require('react-dnd').DropEffects

var ResizableHandle = React.createClass({
    mixins: [DragDropMixin],

    propTypes: {
        //id: PropTypes.any.isRequired,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired
        //hideSourceOnDrag: PropTypes.bool.isRequired
    },

    statics: {
        configureDragDrop:function(register) {
            register(ItemTypes.RESIZABLE_HANDLE, {
                dragSource: {
                    beginDrag:function(component) {
                        return {
                            effectAllowed: DropEffects.MOVE,
                            item: component.props
                        };
                    }
                }
            });
        }
    },
    render:function() {
        var isDragging = this.getDragState(ItemTypes.RESIZABLE_HANDLE).isDragging,
             hideSourceOnDrag = this.props.hideSourceOnDrag;

        if (isDragging && hideSourceOnDrag) {
            return null;
        }

        return (
            <div className="resizable-handle" {...this.dragSourceFor(ItemTypes.RESIZABLE_HANDLE)}
                style={{left: this.props.left,top: this.props.top}}>
            </div>
        );
    }
});

module.exports = ResizableHandle;
