import React from 'react';
import _ from 'lodash';
import {Accordion,Panel,Button,ListGroup,ListGroupItem} from 'react-bootstrap';

export default class ToolBox extends React.Component
{
    handleClick(ctrl) {
        this.props.addCtrl(ctrl.name);
    }

    render() {
        var header = function (name, count) {
            return (<h3>{name} <span className='badge'>{count}</span></h3>);
        };

        return (
            <div>
                <Accordion defaultActiveKey={0}>
                    {this.props.dataSource.map(function (node, i) {
                        return (
                            <Panel header={header(node.type,node.controls.length)} eventKey={i} key={name + i}
                                   bsStyle='primary'>
                                <ListGroup fill>
                                    {node.controls.map(function (ctrl, j) {
                                        return (
                                            <ListGroupItem key={ctrl.name}>
                                                <Button bsStyle='link' onClick={this.handleClick.bind(this,ctrl)}>
                                                    <span>{ctrl.label}</span>
                                                </Button>
                                            </ListGroupItem>
                                        );
                                    }, this)}
                                </ListGroup>
                            </Panel>
                        );
                    }, this)}
                </Accordion>
            </div>
        );
    }
};

ToolBox.defaultProps = {
    dataSource: [
        {
            type: 'Base controls',
            collapsed: false,
            controls: [
                {name: 'Container', label: 'Container'},
                {name: 'Repeater', label: 'Repeater'},
                {name: 'Core.HtmlBox', label: 'HtmlEditor'},
                {name: 'Core.TextBox', label: 'TextBox'},
                {name: 'Core.JSXBox', label: 'JSXBox'},
                {name: 'Core.ValueBox', label: 'ValueBox'},
                {name: 'Core.ImageBox', label: 'ImageBox'},
                {name: 'Core.ImagePanel', label: 'ImagePanel'}
            ]
        },
        {
            type: 'Input controls',
            collapsed: false,
            controls: [
                {name: 'Core.TextBoxInput', label: 'TextBoxInput'},
                {name: 'Core.CheckBoxInput', label: 'CheckBoxInput'},
                {name: 'Core.SelectBoxInput', label: 'SelectBoxInput'},
                {name: 'Core.TangleNumberText', label: 'TangleNumberText'},
                {name: 'Core.TangleBoolText', label: 'TangleBoolText'}
            ]
        },
        {
            type: 'Shapes',
            collapsed: true,
            controls: _.map(['Rectangle', 'Circle', 'Ellipse', 'Line', 'Polyline', 'CornerLine', 'CornerBox'], function (x) {
                return {
                    'name': 'Shapes.' + x, 'label': x
                }
            })
        },
        {
            type: 'React internationalization',
            collapsed: true,
            controls: _.map(['FormattedDate', 'FormattedTime', 'FormattedRelative', 'FormattedNumber', 'FormattedMessage', 'FormattedHTMLMessage'], function (x) {
                return {
                    'name': 'react-intl.' + x, 'label': x
                }
            })
        },
        {
            type: 'Bootstrap controls',
            collapsed: true,
            controls: _.map(['Input', 'Button', 'Panel', 'Glyphicon', 'Tooltip', 'Alert', 'Label'], function (x) {
                return {
                    'name': 'react-bootstrap.' + x, 'label': x
                }
            })
        },
        {
            type: 'Charts',
            collapsed: true,
            controls: _.map(['Bar', 'Pie', 'Tree', 'SmoothLine', 'StockLine', 'Scatterplot', 'Radar'], function (x) {
                return {'name': 'Chart.' + x, 'label': x}
            })
        },
        {
            type: 'Extra controls',
            collapsed: true,
            controls: [
                {name: 'React.Griddle', label: 'Griddle'},
                {name: 'react-pivot', label: 'Pivot table'},
                {name: 'Flipper', label: 'Flipper'},
                {name: 'react-inlinesvg', label: 'SvgBox'},
                {name: 'MovieSelect', label: 'Movie carousel select'}
                //{name: 'Reacticon', label: 'Reacticon'},
                //{name: 'SnapSvgBox', label: 'SnapSvgBox'},
            ]
        }
    ]
}

