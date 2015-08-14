import React from 'react';
import TreeView from 'react-treeview';
import _ from 'lodash';

//var ItemTypes = require('./ItemTypes');
//var DragDropMixin = require('react-dnd').DragDropMixin;
//var DropEffects = require('react-dnd').DropEffects;

var ObjectBrowser = React.createClass({
    getInitialState: function() {
        return {
            filterText: ''
        };
    },
    handleUserInput: function(e) {
        this.setState({
            filterText: e.target.value
        });
    },
    executeAction(action,args){
        if (action === "onDragStart"){
            this.currentItem =  args;
            return;
        }
        if (action === "onDrop"){
            this.move(this.currentItem,args);
            this.currentItem = undefined;
            return;
        }


    },
    move:function(from, to){
        console.log(from.node.name + " -> " + to.node.name);
        // transact returns a mutable object
        // to make all the local changes

        //find source
        var source = from.node;
        var isContainer = source.elementName === "Container";

        //move source to target - do it in transaction
        var targetArray = isContainer? to.node.containers:to.node.boxes;
        targetArray.transact().push(from.node);

        //remove source - do it in transaction
        var sourceParent = isContainer?from.parentNode.containers:from.parentNode.boxes;
        var indexToRemove = sourceParent.indexOf(source);
        console.log(indexToRemove);
        if (indexToRemove !== -1) {
            sourceParent.transact().splice(indexToRemove,1);
        }

        // all the changes are made at once
        targetArray.run();
        sourceParent.run();

        // use it as a normal array
        //trans[0] = 1000; // [1000, 1, 2, ..., 999]
    },
    render: function() {
        return (
            <div>
                <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search for..." onChange={this.handleUserInput} />
                </div>
                <TreeNode key="root" node={this.props.rootNode} current={this.props.current} currentChanged={this.props.currentChanged} filterText={this.state.filterText} executeAction={this.executeAction} />
            </div>
        );
    }
});

var TreeNode = React.createClass({

    handleClick: function(node) {
        this.props.currentChanged(node);
    },
    //statics: {
    //    configureDragDrop: function (register, context) {
    //        register(ItemTypes.TREE_NODE, {
    //            dragSource: {
    //                beginDrag:function(component) {
    //                    return {
    //                        effectAllowed: DropEffects.MOVE,
    //                        item: component.props
    //                    };
    //                }
    //            },
    //            dropTarget: {
    //                acceptDrop: function (component, item) {
    //                    //var delta = context.getCurrentOffsetDelta(),
    //                    //    left = Math.round(isNaN(item.left)?0:parseInt(item.left,10) + delta.x),
    //                    //    top = Math.round(isNaN(item.top)?0:parseInt(item.top,10) + delta.y);
    //
    //                    //component.moveBox(item.index, left, top);
    //                    console.log("move" + item.index);
    //                }
    //            }
    //        });
    //    }
    //},

    //TODO: optimize -> now each node starts its own tree traversal
    hideNode:function(node,filterText){
        var trav = function(node){
            var containers = node.containers;
            var boxes = node.boxes;
            var anyBoxes = _.any(boxes,function(item){return item.name.indexOf(filterText) !== -1});
            if (anyBoxes) return true;
            if (node.name.indexOf(filterText) !== -1) return true;
            //recursion condtion stop
            var childrenBoxes = false;
            for (var i in containers)
            {
                //recursion step
                childrenBoxes = trav(containers[i]);
                if (childrenBoxes) return true;
            }
            return false;
        }

        return !trav(node);
    },
    shouldComponentUpdate: function( nextProps ){
        return true;
        // The comparison is fast, and we won't render the component if
        // it does not need it. This is a huge gain in performance.
        //var current = this.props.current.node;
        //var nextCurrent = nextProps.current.node;
        //return this.props.filterText != nextProps.filterText ||  this.props.nodes != nextProps.nodes || (current!==undefined && nextCurrent !==undefined && current.name != nextCurrent.name);
    },
    render: function() {
        return (
            <div>
        {this.props.node.containers.map(function (node, i) {
            if (this.hideNode(node,this.props.filterText)) return;

            var onDragStart = function(e) {
                console.log('drag started');
                e.stopPropagation();
                var draggingItem = {
                    node: node,
                    parentNode : this.props.node};
                this.props.executeAction("onDragStart",draggingItem);

            }.bind(this);
            var onDragEnter = function(e){
                e.preventDefault(); // Necessary. Allows us to drop.
                e.stopPropagation();
                //window.event.returnValue=false;
                //if (this.props.dragging.type !== this.props.item.type || this.props.dragging.id !== this.props.item.id)  {
                var dropCandidate = {node: node, parentNode:this.props.node};
                //    var self = this;
                this.props.executeAction("dropPossible", dropCandidate);
                //}
            }.bind(this);
            var onDragOver = function(e){
                e.preventDefault(); // Necessary. Allows us to drop.
                e.stopPropagation();
                //window.event.returnValue=false;
            }.bind(this);
            var onDrop = function(e) {
                e.preventDefault();
                e.stopPropagation();
                var dropPlace= {node: node, parentNode: this.props.node};
                this.props.executeAction("onDrop",dropPlace);
            }.bind(this);


            var type = node.elementName;

            var containers = node.containers || [];
            var boxes = node.boxes || [];

            var selected = this.props.current.node === node;
            var parentSelected = this.props.current.parentNode === node;

            var cx = React.addons.classSet;
            var classes = cx({
                'node': true,
                'selected': selected,
                'parentSelected':this.props.parentSelected
            });

            var label = <span draggable="true" onDragEnter={onDragEnter}
                onDragStart = {onDragStart}
                onDragOver = {onDragOver} onDrop={onDrop} className={classes} onClick={this.handleClick.bind(null,node)}>{node.name}</span>;
            return (

                <TreeView key={type + '|' + i} nodeLabel={label} defaultCollapsed={true}>
                    <TreeNode key={node.name + '|' + i} node={node} current={this.props.current} currentChanged={this.props.currentChanged} filterText={this.props.filterText} executeAction={this.props.executeAction} />
                      {boxes.map(function (box, j) {

                          var onDragStart1 = function(e) {
                              console.log('drag started');
                              e.stopPropagation();
                              var draggingItem = {
                                  node: box,
                                  parentNode : node};
                              this.props.executeAction("onDragStart",draggingItem);

                          }.bind(this);

                          if (box.name.indexOf(this.props.filterText) === -1) {
                              return;
                          }

                          var cx = React.addons.classSet;
                          var classes = cx({
                              'node': true,
                              'selected': this.props.current.node === box
                          });
                          return (<div draggable="true"  onDragStart = {onDragStart1} className={classes} onClick={this.handleClick.bind(null,box)} key={box.name + j}>{box.name}</div>);
                      },this)}

                </TreeView>
            );
        }, this)}
            </div>
        );
    }
});

module.exports = ObjectBrowser;
