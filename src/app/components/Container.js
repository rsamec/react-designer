'use strict';

var React = require('react'),
    PropTypes = React.PropTypes,
    ItemTypes = require('./ItemTypes'),
    DragDropMixin = require('react-dnd').DragDropMixin,
    Box = require('./Box'),
    ResizableHandle=require('./ResizableHandle'),
    WidgetFactory = require('./WidgetFactory');

var widgets =  WidgetFactory.getWidgets();

var Container = React.createClass({
    mixins: [DragDropMixin],

    propTypes: {
        //hideSourceOnDrag: PropTypes.bool.isRequired
    },

    statics: {
        configureDragDrop: function (register, context) {
            register(ItemTypes.BOX, {
                dropTarget: {
                    acceptDrop: function (component, item) {
                        var delta = context.getCurrentOffsetDelta(),
                            left = Math.round(isNaN(item.left)?0:parseInt(item.left,10) + delta.x),
                            top = Math.round(isNaN(item.top)?0:parseInt(item.top,10) + delta.y);

                        component.moveBox(item.index, left, top);
                    }
                }
            });
            register(ItemTypes.RESIZABLE_HANDLE, {
                dragSource: {
                    beginDrag: function (component) {
                        return {
                            item: component.props
                        };
                    }
                },
                dropTarget: {
                    acceptDrop: function (component, item) {

                        var delta = context.getCurrentOffsetDelta(),
                            left = Math.round(item.left + 30 + delta.x),
                            top = Math.round(item.top + 30 +  delta.y);

                       component.resizeContainer(item.parent, left, top).bind(this);

                    }
                }
            });
        }
    },

    moveBox: function (index, left, top) {
        var boxes = this.props.boxes;
        if (boxes === undefined) return;
        var box = boxes[index];
        if (box === undefined) return;

        var updated = box.set({'style':{'top':top,'left':left}});
        this.props.currentChanged(updated);
    },
    resizeContainer:function(container,width,height){
        if (container === undefined) return;

        //TODO: use merge instead of clone
        var style = _.clone(container.style);
        style.width = width;
        style.height = height;

        var updated = container.set({'style':style});
        this.props.currentChanged(updated);

    },
    createComponent: function (box) {
        if (widgets[box.elementName] === undefined){
            return React.DOM.span(null,'Component ' + box.elementName + ' is not register among widgets.');
        }
        var props = _.omit(box,'style');
        return React.createElement(widgets[box.elementName],box, box.content!== undefined?React.DOM.span(null, box.content):undefined);
    },
    handleClick: function (e) {
        e.stopPropagation();
        if (this.props.handleClick !== undefined) this.props.handleClick();
    },
    shouldComponentUpdate: function( nextProps ){

        // The comparison is fast, and we won't render the component if
        // it does not need it. This is a huge gain in performance.
        var current = this.props.current.node;
        var nextCurrent = nextProps.current.node;
        return this.props.containers != nextProps.containers || this.props.boxes != nextProps.boxes || (current!==undefined && nextCurrent !==undefined && current.name != nextCurrent.name);
    },
    render: function () {

        var containers = this.props.containers || [];
        var boxes = this.props.boxes || [];

        //styles
        var cx = React.addons.classSet;
        var classes = cx({
            'cContainer': true,
            'selected': this.props.selected,
            'parentSelected':this.props.parentSelected,
            'root': this.props.isRoot
        });

        var styles = {
            left: this.props.left,
            top: this.props.top,
            height: this.props.height,
            width: this.props.width,
            position: this.props.position
        };

        //resize handle position
        var handle = 30;
        var resizeHandlePosition = {top:(this.props.height-handle), left: (this.props.width -handle)};


        return (
            <div className={classes} style={styles} onClick={this.handleClick}
            {...this.dropTargetFor(ItemTypes.BOX,ItemTypes.RESIZABLE_HANDLE)}
            >
                <div>
             {containers.map(function (container,index) {

                 var selected = container === this.props.current.node;
                 var parentSelected = container === this.props.current.parentNode;
                 var key = container.name + index;

                 var handleClick = function () {
                     if (this.props.currentChanged !== undefined) this.props.currentChanged(container);
                 }.bind(this);

                 var left = container.style.left===undefined?0:parseInt(container.style.left,10);
                 var top = container.style.top===undefined?0:parseInt(container.style.top,10);
                 return (
                     <Container key={key}
                         index={index}
                         left={left}
                         top={top}
                         height={container.style.height}
                         width={container.style.width}
                         position={container.style.position}
                         boxes={container.boxes}
                         containers={container.containers}
                         currentChanged={this.props.currentChanged}
                         current={this.props.current}
                         handleClick={handleClick}
                         parent={container}
                         parentSelected={parentSelected}
                         selected={selected}
                     />
                 );
             }, this)
                 }

                {boxes.map(function (box, index) {

                    var selected = box === this.props.current.node;
                    var key = box.name + index;

                    var handleClick = function () {
                        if (this.props.currentChanged !== undefined) this.props.currentChanged(box);
                    }.bind(this);

                    var boxComponent = this.createComponent(box, key);
                    var left = box.style.left===undefined?0:parseInt(box.style.left,10);
                    var top = box.style.top===undefined?0:parseInt(box.style.top,10);
                    return (
                        <Box key={key}
                            index={index}
                            left={left}
                            top={top}
                            selected={selected}
                            hideSourceOnDrag={this.props.hideSourceOnDrag}
                            handleClick={handleClick}>
                                {boxComponent}
                        </Box>
                    );
                }, this)
                    }
                    </div>
                <ResizableHandle left={resizeHandlePosition.left} top={resizeHandlePosition.top} parent={this.props.parent} />
            </div>
        );
    }
});

module.exports = Container;
