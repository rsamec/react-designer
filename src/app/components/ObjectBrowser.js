var React = require('react');
var TreeView = require('react-treeview');



var ObjectBrowser = React.createClass({

    render: function() {
        return (
            <div>
                <div class="input-group">
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
    render: function() {
        return (
            <div>
        {this.props.nodes.map(function (node, i) {
//            if (node === null)  this.props.nodes.splice(0,1);// {elementName:"Container",name:"!!!"}
            var type = node.elementName;
            var selected = this.props.current === node;
            var cssClass = 'node';
            if (selected) cssClass += ' selected';

            var label = <span className={cssClass} onClick={this.handleClick.bind(null,node)}>{node.name}</span>;
            var containers = node.containers || [];
            var boxes = node.boxes || [];

            return (
                <TreeView key={type + '|' + i} nodeLabel={label} defaultCollapsed={true}>
                    <TreeNode nodes={containers} current={this.props.current} currentChanged={this.props.currentChanged} />

                      {boxes.map(function (box, i) {
                          var selected = this.props.current === box;
                          var cssClass = 'node';
                          if (selected) cssClass += ' selected';

                          return (<div className={cssClass} onClick={this.handleClick.bind(null,box)} >{box.name}</div>);
                      },this)}

                </TreeView>
            );
        }, this)}
            </div>
        );
    }
});

module.exports = ObjectBrowser;
