'use strict';

var React = require('react');
var TreeView = require('react-treeview');

var ObjectBrowser = React.createClass({

    render: function() {
        return (
            <div>
                <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search for..." />
                </div>
                <TreeNode nodes={this.props.nodes} current={this.props.current} currentChanged={this.props.currentChanged} />
            </div>
        );
    }
});

var TreeNode = React.createClass({
    handleClick: function(node) {
        this.props.currentChanged(node);
    },
    shouldComponentUpdate: function( nextProps ){
        // The comparison is fast, and we won't render the component if
        // it does not need it. This is a huge gain in performance.
        var current = this.props.current.node;
        var nextCurrent = nextProps.current.node;
        return this.props.nodes != nextProps.nodes || (current!==undefined && nextCurrent !==undefined && current.name != nextCurrent.name);
    },
    render: function() {
        return (
            <div>
        {this.props.nodes.map(function (node, i) {
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

            var label = <span className={classes} onClick={this.handleClick.bind(null,node)}>{node.name}</span>;
            return (
                <TreeView key={type + '|' + i} nodeLabel={label} defaultCollapsed={true}>
                    <TreeNode nodes={containers} current={this.props.current} currentChanged={this.props.currentChanged} />
                      {boxes.map(function (box, i) {

                          var cx = React.addons.classSet;
                          var classes = cx({
                              'node': true,
                              'selected': this.props.current.node === box
                          });
                          return (<div className={classes} onClick={this.handleClick.bind(null,box)} >{box.name}</div>);
                      },this)}

                </TreeView>
            );
        }, this)}
            </div>
        );
    }
});

module.exports = ObjectBrowser;
