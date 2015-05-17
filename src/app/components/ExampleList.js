'use strict';

var React = require('react');

//bootstrap
var ReactBootstrap = require('react-bootstrap');
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Button = ReactBootstrap.Button;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;


var request = require('superagent');

var ExampleList = React.createClass({
    getDefaultProps:function(){
        return {
            dataSource: [
                {
                    type: 'Documents',
                    collapsed: false,
                    examples:[
                        {name: 'Invoice', label: 'Invoice'},
                        {name: 'Contracts', label: 'Contract'},
                        {name: 'Texts', label: 'Text'}
                    ]
                },
                {
                    type: 'Extras',
                    collapsed: true,
                    examples: [
                        {name: 'Pivot', label: 'Pivot table'},
                    ]
                },
            ]
        }
    },
    handleClick: function(ctrl) {
        request.get('assets/examples/' + ctrl.name + '.json')
            .end(function(err, res){
                if (res.ok) {
                    if (this.isMounted()) {
                        //alert(JSON.stringify(res.body));
                        //this.setState({
                        //    objectSchema: res.body
                        //});
                        this.props.loadSchema(res.body,ctrl.name);
                    }
                } else {
                    alert('Oh no! error ' + res.text);
                }
            }.bind(this));

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
                    <Panel header={header(node.type,node.examples.length)} eventKey={i} key={name + i} bsStyle='primary'>
                        <ListGroup fill>
                      {node.examples.map(function(ctrl, j) {
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

module.exports = ExampleList;
