'use strict';

var React = require('react'),
    PropTypes = React.PropTypes,
    ItemTypes = require('./ItemTypes'),
    DragDropMixin =require('react-dnd').DragDropMixin,
    DropEffects = require('react-dnd').DropEffects,
    ResizableHandle=require('./ResizableHandle');

var WidgetRenderer = require('./WidgetRenderer');
var Widgets = require('./WidgetFactory');

var Box = React.createClass({
    mixins: [DragDropMixin],

    propTypes: {
        index:PropTypes.number.isRequired,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        selected:PropTypes.bool.isRequired,
        handleClick:PropTypes.any.isRequired
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
        }
    },
    handleClick:function(e){
        e.stopPropagation();
        if (this.props.handleClick !== undefined) this.props.handleClick();
    },
    shouldComponentUpdate: function (nextProps) {

        // The comparison is fast, and we won't render the component if
        // it does not need it. This is a huge gain in performance.
        var update = this.props.node !== nextProps.node ||  this.props.selected != nextProps.selected;;
        //console.log(this.props.node.name + " -> " + update);
        return update;//update;
    },
    render:function() {
        //drag and drop behaviour
        var isDragging = this.getDragState(ItemTypes.BOX).isDragging,
             hideSourceOnDrag = this.props.hideSourceOnDrag;

        if (isDragging && hideSourceOnDrag) {
            return null;
        }

        //prepare styles
        var cx = React.addons.classSet;
        var classes = cx({
            'box':true,
            'selected':this.props.selected
        });

        var box = this.props.node;
        var customStyle = this.props.ctx["styles"][box.elementName];
        var intlData = this.props.ctx["intlData"];
        var boxComponent = <WidgetRenderer widget={Widgets[box.elementName]} node={box} dataBinder={this.props.dataBinder} customStyle={customStyle} intlData={intlData} />;
        return (
            <div className={classes} {...this.dragSourceFor(ItemTypes.BOX)}
                style={{left: this.props.left,top: this.props.top}} onClick={this.handleClick}>
                {boxComponent}
            </div>
        );
    }
});

module.exports = Box;
