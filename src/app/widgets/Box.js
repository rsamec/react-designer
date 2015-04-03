'use strict';

var React = require('react'),
    ItemTypes = require('../components/ItemTypes'),
    PropTypes = React.PropTypes,
   DragDropMixin =require('react-dnd').DragDropMixin,
    DropEffects = require('react-dnd').DropEffects,
    ResizableHandle=require('./../components/ResizableHandle')

var Box = React.createClass({
    mixins: [DragDropMixin],

    propTypes: {
        id: PropTypes.any.isRequired,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired
        //hideSourceOnDrag: PropTypes.bool.isRequired
    },

    statics: {
        configureDragDrop:function(register,context) {
            register(ItemTypes.BOX, {
                dragSource: {
                    beginDrag:function(component) {
                        return {
                            effectAllowed: DropEffects.MOVE,
                            item: component.props
                        };
                    }
                }
            });
            //register(ItemTypes.RESIZABLE_HANDLE, {
            //    dropTarget: {
            //        over: function (component, item) {
            //
            //            var delta = context.getCurrentOffsetDelta(),
            //                left = Math.round(item.left + 30 + delta.x),
            //                top = Math.round(item.top + 30 +  delta.y);
            //
            //
            //            //console.log(item.id + " -> " + component.props.id);
            //            console.log(left + ", " + top + ".")
            //            //component.moveBox(item.index, left, top);
            //            component.resizeBox(component.props.model, left,top);
            //        }
            //    }
            //});
        }
    },
    handleClick:function(e){
        e.stopPropagation();
        if (this.props.handleClick !== undefined) this.props.handleClick();
    },
    //resizeBox:function(model,width,height){
    //    //var item = this.props.containers.items[index];
    //    if (model === undefined) return;
    //
    //    var box = model.value;
    //    box.style.width = width;
    //    box.style.height = height;
    //
    //    model.notifyChange();
    //},
    render:function() {
        var isDragging = this.getDragState(ItemTypes.BOX).isDragging,
             hideSourceOnDrag = this.props.hideSourceOnDrag;

        if (isDragging && hideSourceOnDrag) {
            return null;
        }
        //var handle = 30;
        //var size = {top:(this.props.height-handle), left: (this.props.width -handle)};

        var cssClass = 'cBox';
        if (this.props.selected) cssClass += ' selected';
        return (
            <div className={cssClass} {...this.dragSourceFor(ItemTypes.BOX)}
                style={{left: this.props.left,top: this.props.top}} onClick={this.handleClick}>
                    {this.props.children}

            </div>
        );
    }
});

module.exports = Box;
