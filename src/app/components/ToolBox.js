'use strict';

var React = require('react');

//bootstrap
var ReactBootstrap = require('react-bootstrap');
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Button = ReactBootstrap.Button;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

var ToolBox = React.createClass({
    getDefaultProps:function(){
        return {
            dataSource: [
                {
                    type: 'Base controls',
                    collapsed: false,
                    controls:[
                        {name: 'Container', label: 'Container'},
                        {name: 'Repeater', label: 'Repeater'},
                        {name: 'HtmlBox', label: 'HtmlEditor'},
                        {name: 'TextBox', label: 'TextBox'},
                        {name: 'JSXBox', label: 'JSXBox'},
                        {name: 'ValueBox', label: 'ValueBox'},
                        {name: 'ImageBox', label: 'ImageBox'}
                    ]
                },
                {
                    type: 'Input controls',
                    collapsed: false,
                    controls:[
                        {name: 'TextBoxInput', label: 'TextBoxInput'},
                        {name: 'CheckBoxInput', label: 'CheckBoxInput'}
                    ]
                },
                {
                    type: 'Shapes',
                    collapsed: true,
                    controls:_.map(['Rectangle','Circle', 'Ellipse','Line','Polyline','CornerLine','CornerBox'],function(x){return {
                        'name':'Shapes.' + x, 'label': x}
                    })
                },
                {
                    type: 'Bootstrap controls',
                    collapsed: true,
                    controls:_.map(['Input','Button', 'Panel','Glyphicon','Tooltip','Alert','Label'],function(x){return {
                        'name':'ReactBootstrap.' + x, 'label': x}
                    })
                },
                //{
                //    type: 'Charts',
                //    collapsed: true,
                //    controls:[{name: 'ChartistGraph', label: 'Chart'}].concat(_.map(['LineChart','BarChart','AreaChart','Treemap','PieChart','ScatterChart','CandleStickChart'],function(x){return { 'name':'ReactD3.' + x, 'label': x}}))
                //},
                {
                    type: 'Extra controls',
                    collapsed: true,
                    controls: [
                        {name: 'ChartistGraph', label: 'Chart'},
                        {name: 'React.Griddle', label: 'Griddle'},
                        {name: 'react-pivot', label: 'Pivot table'},
                        {name: 'Flipper', label: 'Flipper'},
                        {name: 'react-inlinesvg', label: 'SvgBox'},
                        //{name: 'Reacticon', label: 'Reacticon'},
                        //{name: 'SnapSvgBox', label: 'SnapSvgBox'},
                    ]
                },
            ]
        }
    },
    handleClick: function(ctrl) {
        this.props.addCtrl(ctrl.name);
    },
    render: function() {
        var header = function(name, count){
            return (<h3>{name} <span className='badge'>{count}</span></h3>);
        };

        return (
            <div>
                <Accordion defaultActiveKey={0}>
            {this.props.dataSource.map(function(node, i) {
                return (
                    <Panel header={header(node.type,node.controls.length)} eventKey={i} key={name + i} bsStyle='primary'>
                        <ListGroup fill>
                      {node.controls.map(function(ctrl, j) {
                          return (
                              <ListGroupItem  key={ctrl.name}>
                                  <Button bsStyle='link' onClick={this.handleClick.bind(null,ctrl)} >
                                      <span>{ctrl.label}</span>
                                  </Button>
                              </ListGroupItem>
                          );
                      },this)}
                            </ListGroup>
                    </Panel>
                );
            }, this)}
                </Accordion>
            </div>
        );
    }
});

module.exports = ToolBox;
