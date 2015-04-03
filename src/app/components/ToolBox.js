var React = require('react');
var TreeView = require('react-treeview');

var ToolBox = React.createClass({
    getDefaultProps:function(){
        var bootstrapWidgets = ["Input","Button", "Panel","Glyphicon","Tooltip"];
        var bootstrapControls = [];
        _.each(bootstrapWidgets,function(widgetName){
            var name = "ReactBootstrap." + widgetName;
            bootstrapControls.push({'name':name, 'label': widgetName});
        });

        return {
            dataSource: [
                {
                    type: 'Common',
                    collapsed: false,
                    controls:[
                        {name: 'Container', label: 'Container'},
                    ]
                },
                {
                    type: 'Input',
                    collapsed: true,
                    controls: [
                        {name: 'TextBoxInput', label: 'TextBox'},
                        {name: 'CheckBoxInput', label: 'CheckBox'},
                    ]
                },
                {
                    type: 'Grids',
                    collapsed: true,
                    controls: [
                        {name: 'React.Griddle', label: 'Griddle'}
                    ]
                },
                {
                    type: 'ReactBootstrap',
                    collapsed: true,
                    controls:bootstrapControls
                },
                {
                    type: 'Print',
                    collapsed: true,
                    controls: [
                        {name: 'TinyMceEditor', label: 'HtmlEditor'},
                        {name: 'TextBox', label: 'TextBox'},
                        {name: 'ValueBox', label: 'ValueBox'},
                    ]
                }
            ]
        }
    },
    handleClick: function(ctrl) {
        this.props.addCtrl(ctrl.name);
    },
    render: function() {
        return (
            <div>
            {this.props.dataSource.map(function(node, i) {
                var type = node.type;
                var label = <span className="node">{type}</span>;
                return (
                    <TreeView key={type + '|' + i} nodeLabel={label} defaultCollapsed={false}>
                      {node.controls.map(function(ctrl, j) {
                          return (
                              <button type="button" className="btn btn-primary" onClick={this.handleClick.bind(null,ctrl)} >
                                  <span>{ctrl.label}</span>
                              </button>
                          );
                      },this)}
                    </TreeView>
                );
            }, this)}
            </div>
        );
    }
});

module.exports = ToolBox;
