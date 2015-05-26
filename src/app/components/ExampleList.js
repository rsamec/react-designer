'use strict';

var React = require('react');

//bootstrap
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

var formService = require('../services/formService');
var request = require('superagent');

var ExampleList = React.createClass({
    getInitialState() {
        return {
            schemaList: []
        }
    },
    componentDidMount: function () {
        formService.getSchemaList().then(
            function (schemas) {
                if (this.isMounted()) {
                    //alert(JSON.stringify(res.body));
                    this.setState({
                        schemaList: schemas
                    });
                }
            }.bind(this),
            function (err) {
                console.log(error)
            });
    },
    handleClick: function (ctrl) {
        formService.getSchema(ctrl.name).then(
            function (schema) {
                if (this.isMounted()) {
                    //alert(JSON.stringify(res.body));
                    this.props.loadSchema(schema, ctrl.name);
                }
            }.bind(this),
            function (err) {
                console.log(error)
            });
    },
    render: function () {
        return (
            <div>

                <ListGroup fill>
                      {this.state.schemaList.map(function (ctrl, j) {
                          return (
                              <ListGroupItem  key={ctrl.name + '|' + j}>
                                  <Button bsStyle='link' onClick={this.handleClick.bind(null, ctrl)} >
                                      <span>{ctrl.label}</span>
                                  </Button>
                              </ListGroupItem>
                          );
                      }, this)}
                </ListGroup>


            </div>
        );
    }
});

module.exports = ExampleList;
