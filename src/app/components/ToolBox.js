var React = require('react');
//var TreeView = require('react-treeview');
var ReactBootstrap = require('react-bootstrap');
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;

var ToolBox = React.createClass({
    getDefaultProps:function(){
        return {
            dataSource: [
                {
                    type: 'Common',
                    collapsed: false,
                    controls:[
                        {name: 'Container', label: 'Container'},
                        {name: 'Repeater', label: 'Repeater'},
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
                    type: 'Print',
                    collapsed: true,
                    controls: [
                        {name: 'TinyMceEditor', label: 'HtmlEditor'},
                        {name: 'TextBox', label: 'TextBox'},
                        {name: 'ValueBox', label: 'ValueBox'},
                        {name: 'ImageBox', label: 'ImageBox'},
                    ]
                },
                {
                    type: 'ReactBootstrap',
                    collapsed: true,
                    controls:_.map(["Input","Button", "Panel","Glyphicon","Tooltip"],function(x){return {
                        'name':"ReactBootstrap." + x, 'label': x}
                    })
                },
                {
                    type: 'Charts',
                    collapsed: true,
                    controls:_.map( ["Line","Bar","Radar","Polar","Pie","Doughnut"],function(x){return {
                        'name':"ReactChartJs." + x, 'label': x}
                    })
                },
                {
                    type: 'Others',
                    collapsed: true,
                    controls: [
                        {name: 'React.Griddle', label: 'Griddle'}
                    ]
                },


            ]
        }
    },
    handleClick: function(ctrl) {
        this.props.addCtrl(ctrl.name);
    },
    render: function() {
        return (
            <div>
                <Accordion>
            {this.props.dataSource.map(function(node, i) {
                return (
                    <Panel header={node.type} eventKey={i}>
                      {node.controls.map(function(ctrl, j) {
                          return (
                              <button type="button" className="btn btn-primary" onClick={this.handleClick.bind(null,ctrl)} >
                                  <span>{ctrl.label}</span>
                              </button>
                          );
                      },this)}
                    </Panel>
                );
            }, this)}
                </Accordion>
            </div>
        );
    }
});

module.exports = ToolBox;
