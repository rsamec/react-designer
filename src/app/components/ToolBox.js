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
                    type: 'Components',
                    collapsed: false,
                    controls:[
                        {name: 'Container', label: 'Container'},
                        {name: 'Repeater', label: 'Repeater'},
                        {name: 'TextBoxInput', label: 'TextBoxInput'},
                        {name: 'CheckBoxInput', label: 'CheckBoxInput'},
                        {name: 'HtmlBox', label: 'HtmlEditor'},
                        {name: 'TextBox', label: 'TextBox'},
                        {name: 'JSXBox', label: 'JSXBox'},
                        {name: 'ValueBox', label: 'ValueBox'},
                        {name: 'ImageBox', label: 'ImageBox'},
                        {name: 'Flipper', label: 'Flipper'},
                        {name: 'CollapsibleTree', label: 'CollapsibleTree'},
                        {name: 'react-inlinesvg', label: 'SvgBox'},
                        {name: 'react-3d-carousel', label: 'Carousel 3D'}
                        //{name: 'Reacticon', label: 'Reacticon'},
                        //{name: 'SnapSvgBox', label: 'SnapSvgBox'},
                    ]
                },
                {
                    type: 'Bootstrap',
                    collapsed: true,
                    controls:_.map(['Input','Button', 'Panel','Glyphicon','Tooltip','Alert','Label'],function(x){return {
                        'name':'ReactBootstrap.' + x, 'label': x}
                    })
                },
                {
                    type: 'Charts',
                    collapsed: true,
                    controls:_.map(['LineChart','BarChart','AreaChart','Treemap','PieChart','ScatterChart','CandleStickChart'],function(x){return { 'name':'ReactD3.' + x, 'label': x}})
                },
                {
                    type: 'Grids',
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
