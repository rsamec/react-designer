'use strict';

var React = require('react'),
    update = require('react/lib/update'),
    ItemTypes = require('../components/ItemTypes'),
    Box = require('./Box'),
    PropTypes = React.PropTypes,
    DragDropMixin = require('react-dnd').DragDropMixin,
    BindToMixin = require('react-binding'),
    ResizableHandle=require('../components/ResizableHandle'),
    WidgetFactory = require('../components/WidgetFactory');


var widgets =  WidgetFactory.getWidgets();

var Container = React.createClass({
    mixins: [DragDropMixin, BindToMixin],

    propTypes: {
        //hideSourceOnDrag: PropTypes.bool.isRequired
    },

    //getInitialState:function() {
    //    return {
    //        boxes: {
    //            'a': { top: 20, left: 80, title: 'Drag me around' },
    //            'b': { top: 180, left: 20, title: 'Drag me too' }
    //        }
    //    };
    //},

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
            //register(ItemTypes.CONTAINER, {
            //    dragSource: {
            //        beginDrag: function (component) {
            //            return {
            //                item: {
            //                    id: component.props.id
            //                }
            //            };
            //        }
            //    },
            //    dropTarget: {
            //        over: function (component, item) {
            //            //console.log(item.id + " -> " + component.props.id);
            //            component.props.moveContainer(item.id, component.props.id);
            //        }
            //    }
            //});
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

                       component.resizeCont(item.parent, left, top).bind(this);

                    }
                }
            });
        }
    },

    moveBox: function (index, left, top) {

        if (this.props.boxes === undefined)return;
        var item = this.props.boxes[index];
        if (item === undefined) return;
        var box = item;

        var updated = box.set({'style':{'top':top,'left':left}});
        this.props.currentPropChanged(updated);
    },
    resizeCont:function(model,width,height){
        if (model === undefined) return;

        //TODO: use merge
        //console.log('WIDTH' + width + ',' +height);
        var style = _.clone(model.style);
        style.width = width;
        style.height = height;
        var updated = model.set({'style':style});
        this.props.currentPropChanged(updated);

    },
    createComponent: function (box) {
        if (widgets[box.elementName] === undefined){
            return React.DOM.span(null,"Component '" + box.elementName + "' is not register among widgets.")
        }

        if (box.elementName === "TinyMceEditor") {
            var selfCurrentSetter = this.props.currentPropChanged;
            var contentSetter = function(content){
                var updated = box.set({'content':content});
                selfCurrentSetter(updated);
                box = updated;
            }
            return React.createElement(widgets[box.elementName], {'tinyMceEditor':this.props.tinyMceEditor,'content':box.content, contentSetter:contentSetter});
        }

        return React.createElement(widgets[box.elementName],_.omit(box,'style'), box.content!== undefined?React.DOM.span(null, box.content):undefined);
    },
    handleClick: function (e) {
        e.stopPropagation();

        if (this.props.handleClick !== undefined) this.props.handleClick();
    },
    render: function () {
        var containers = _.filter(this.props.containers || [],function(cont){return !!cont});
        var boxes = this.props.boxes || [];
        var handle = 30;

        var size = {top:(this.props.height-handle), left: (this.props.width -handle)};
        var cssClass = 'cContainer';
        if (this.props.selected) cssClass += ' selected';
        return (
            <div className={cssClass} onClick={this.handleClick}  style={{
                left: this.props.left,
                top: this.props.top,
                height: this.props.height,
                width: this.props.width,
                position: this.props.position
            }}
            {...this.dropTargetFor(ItemTypes.BOX,ItemTypes.RESIZABLE_HANDLE)}

            >
                <div>
             {containers.map(function (item,index) {

                 var box = item;
                 var selected = box === this.props.current;
                 var key = box.name;
                 var handleClick = function () {
                     if (this.props.currentPropChanged !== undefined) this.props.currentPropChanged(box);
                 }.bind(this);


                 return (
                     <Container key={key}
                         id={key}
                         index={index}
                         left={box.style.left}
                         top={box.style.top}
                         height={box.style.height}
                         width={box.style.width}
                         position={box.style.position}
                         tinyMceEditor={this.props.tinyMceEditor}
                         boxes={item.boxes}
                         containers={item.containers}
                         currentPropChanged={this.props.currentPropChanged}
                         current={this.props.current}
                         handleClick={handleClick}
                         model={item}
                         selected={selected}
                         moveContainer={this.moveContainer}
                     >

                     </Container>
                 );
             }, this)
                 }

                {boxes.map(function (item, index) {
                    var box = item;
                    var selected = box === this.props.current;
                    var key = box.name;
                    var handleClick = function () {
                        if (this.props.currentPropChanged !== undefined) this.props.currentPropChanged(box);
                    }.bind(this);
                    var boxComponent = this.createComponent(item, key);
                    return (
                        <Box key={key}
                            id={key}
                            index={index}
                            left={box.style.left}
                            top={box.style.top}
                            model={item}
                            selected={selected}
                            hideSourceOnDrag={this.props.hideSourceOnDrag}
                            handleClick={handleClick}>
                                {boxComponent}
                        </Box>
                    );
                }, this)
                    }
                    </div>
                <ResizableHandle left={size.left} top={size.top} parent={this.props.model} />
            </div>
        );
    }
});

module.exports = Container;
