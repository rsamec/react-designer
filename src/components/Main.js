import React from 'react';
import _ from 'lodash';
import Designer from './Designer';
import $ from 'jquery';

//require('normalize.css');
require('styles/App.css');
require('styles/react-flexr.css');
require('styles/RichEditor.css');
require('styles/react-property-editor.css');
require('styles/react-colors-picker.css');
require('styles/article-image-box.css');
require('styles/react-input-range.css');

const BASE_SERVICE_URL = 'http://www.paperify.io';
//const BASE_SERVICE_URL = 'http://photo-papermill.rhcloud.com';
//const BASE_SERVICE_URL = 'http://render-pergamon.rhcloud.com';
//const BASE_SERVICE_URL = 'http://localhost:8080';
let SERVICE_URL = BASE_SERVICE_URL + '/api';

export default class AppContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      storeHistory: [props.store.get()],
      currentStore: 0
    };

    this.saveChanges = _.debounce(this.saveChanges,10000);
  }
  undo() {
    var nextIndex = this.state.currentStore - 1;
    if (nextIndex < 0 ) return;
    this.props.store.set(this.state.storeHistory[nextIndex]);
    this.setState({currentStore: nextIndex});
  }

  redo() {
    var nextIndex = this.state.currentStore + 1;
    if (nextIndex > this.state.storeHistory.length -1) return;
    this.props.store.set(this.state.storeHistory[nextIndex]);
    this.setState({currentStore: nextIndex});
  }

  clearHistory() {
    this.setState({
      storeHistory: [this.props.store.get()],
      currentStore: 0
    });
  }

  componentDidMount() {
    var me = this;

    // 2. Your app get re-rendered on any state change
    this.props.store.on('update', function ( state ) {

      var storeHistory, nextIndex;
      // Check if this state has not been set by the history
      if (state != me.state.storeHistory[me.state.currentStore]) {

        nextIndex = me.state.currentStore + 1;
        storeHistory = me.state.storeHistory.slice(0, nextIndex);
        storeHistory.push(state);

        // Set the state will re-render our component
        me.setState({
          storeHistory: storeHistory,
          currentStore: nextIndex
        });

        me.saveChanges();
      }
      else {
        // The change has been already triggered by the state, no need of re-render
      }

      //me.forceUpdate()
    });
  }

  schema(){
    return this.props.store.get().schema;
  }

  saveChanges(){

    if (this.props.schemaId === undefined) return;
    return;//console.log('Attempt to save changes .');

    //return;
    var schema = this.schema();
    var name = schema.name;

    $.ajax({
      type: 'PUT',
      url: SERVICE_URL + '/docs/' + this.props.schemaId,
      data: {
        schemaTemplate: JSON.stringify(schema),
        name: name,
        owner: '56b1147e42dea27c23ba397e'
      },
      dataType: 'json',
      success: function () {
        //console.log('Save success.');
      },
      error: function () {
        //console.log('Save failure.');
      }
    })
  }
  generate(type) {

    var contentType = 'image/' + type;
    if (type === 'pdf') contentType = 'application/pdf';
    //var url = 'http://render-pergamon.rhcloud.com';
    //var url = 'http://photo-papermill.rhcloud.com';
    //var url = 'http://localhost:8080';
    //var name = this.context.router.getCurrentParams().name;

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open('POST', SERVICE_URL + '/' + type);

    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlhttp.responseType = 'arraybuffer';

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var blob = new Blob([xmlhttp.response], {type: contentType});
        var fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      }
    };
    xmlhttp.send(JSON.stringify(this.schema()));
  }
  publish() {
    var me = this;
    var schema = this.schema();
    var name = schema.name;

    me.setState({publishOpen: true, published: false});
    $.ajax({
      type: 'POST',
      url: SERVICE_URL + '/docs',
      data: {
        schemaTemplate: JSON.stringify(schema),
        name: name,
        owner: '56b1147e42dea27c23ba397e'
      },
      dataType: 'json',
      success: function (data) {
        me.setState({
          published: true,
          publishInfo: {
            name: data.name,
            url:  BASE_SERVICE_URL + '/view/#/' + data._id
          }
        })
      },
      error: function () {
        alert('failed');
      }
    })
  }
  render() {
    // 1. Your app receives the state
    var state = this.props.store.get();


    var editorState = {
        undo:this.undo.bind(this),
        redo:this.redo.bind(this),
        clearHistory:this.clearHistory.bind(this),
        publish:this.publish.bind(this),
        generate:this.generate.bind(this),
        canUndo:!this.state.currentStore,
        canRedo:this.state.currentStore == this.state.storeHistory.length - 1
    }

    return <Designer state={ state } editorState={editorState} />;
  }

}
