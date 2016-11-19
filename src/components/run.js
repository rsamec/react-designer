import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Freezer from 'freezer-js';
import $ from 'jquery';
import Spinner from 'react-loader';
import AppContainer from './Main';


// Create a Freezer store
var freezer  = new Freezer({
  schema: {
    elementName: 'ObjectSchema',
    name: 'New Document',
    containers: []
  }
});

const BASE_SERVICE_URL = 'http://www.paperify.io';
//const BASE_SERVICE_URL = 'http://photo-papermill.rhcloud.com';
//const BASE_SERVICE_URL = 'http://render-pergamon.rhcloud.com';
//const BASE_SERVICE_URL = 'http://localhost:8080';
let SERVICE_URL = BASE_SERVICE_URL + '/api';

export default class DesignView extends React.Component {
  constructor(props){
    super(props);
    this.state = {loaded:false}
  }

  componentDidMount() {
    //nothing to load - fallback to empty
    if (this.props.params.id === undefined) {
      this.setState({loaded:true});
      return;
    }

    //load schema
    var schemaId = this.props.params.id;
    var url = SERVICE_URL + '/docs/' + schemaId;
    var me = this;
    $.ajax({
      type: 'GET',
      url:url,
      dataType: 'json',
      success: function (data) {
        var schema = JSON.parse(data.schemaTemplate);
        freezer = new Freezer({schema: schema});
        me.setState({
          loaded: true,
          schemaId:schemaId
        });
      },
      error: function (xhr) {
        me.setState({
          loaded: false,
          error: {
            hasError: true, errorMessage: xhr.responseText
          }
        });
      }
    })
  }

  render() {
    return <Spinner loaded={this.state.loaded}>
      <AppContainer store={ freezer } schemaId={this.state.schemaId}/>
    </Spinner>
  }
}
// let Spinner = (props) => {
//   if (props.error!== undefined && props.error.hasError) return <span>{props.error.errorMessage}</span>
//   return <span>Loading...</span>
// }


// Render the main component into the dom
class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

ReactDOM.render((
  // Render the main component into the dom
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={DesignView}/>
      <Route path=":id" component={DesignView}/>
    </Route>
  </Router>
), document.getElementById('app'));

//ReactDOM.render(<App />, document.getElementById('app'));
