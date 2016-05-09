import React from 'react';
import {Workplace, ObjectBrowser} from 'react-designer-core';
import SplitPane from 'react-split-pane';
import Dock from 'react-dock';
import _ from 'lodash';

import Widgets from './Widgets';
import WidgetRenderer from './WidgetRenderer';
import Toolbar from './Toolbar';
import ObjectPropertyGrid from './ObjectPropertyGrid';
import Preview from './Preview';
import ToolBox from './toolbox/ToolBox';

import {Modal} from 'react-overlays';
import ModalStyles from './ModalStyles.js';
import FilePickerDialog from './FilePickerDialog';

let FixedHeader = (props) => {
  return (<div style={{position:'absolute',width:'100%',paddingRight:30}}>
    <div className="toolBox header" style={{width:'100%',position:'relative',zIndex:2}}>
      {props.children}
    </div>
  </div>)
}
export default class Designer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: {
        node: props.state.schema
      },
      snapGrid: [10, 10]
    }
  }

  currentChanged(currentNode, path) {
    if (currentNode === undefined) return;
    var parent = currentNode.__.parents;
    var parentNode = parent.length !== 0 ? parent[0].__.parents[0] : undefined;
    this.setState({
        current: {
          node: currentNode,
          parentNode: parentNode,
          path: path === undefined ? this.state.current && this.state.current.path : path
        }
      }
    );
  }

  // addNewContainer(elName) {
  //
  //   var itemToAdd = {
  //     name: 'New Container',
  //     elementName: elName,
  //     style: (elName === 'Container' ||  elName === 'BackgroundContainer') ? {height: 200, width: 740} : {},
  //     containers: [],
  //     boxes: []
  //   };
  //   this.addNewItem(itemToAdd);
  // }
  //
  // addNewCtrl(elName) {
  //   var itemToAdd = {
  //     name: 'New Widget',
  //     elementName: elName,
  //     style: {}
  //   };
  //   this.addNewItem(itemToAdd);
  // }

  addNewItem(elName, itemToAdd) {
    var current = this.state.current.node;
    if (current === undefined) return;

    if (itemToAdd.container !== undefined) itemToAdd = _.cloneDeep(itemToAdd.container);

    if (itemToAdd.name === undefined) itemToAdd['name'] = itemToAdd.elementName;
    if (itemToAdd.style === undefined) itemToAdd['style'] = {};

    var type = itemToAdd.containers !== undefined ? 'containers' : 'boxes';
    //init empty collection if needed
    var updated = (current[type] === undefined) ? current.set({[type]: [itemToAdd]}) : current[type].push(itemToAdd).__.parents[0];

    this.currentChanged(updated);
  }

  reloadSchema(objectSchema) {

    var updated = this.props.state.schema.reset(objectSchema);
    this.props.editorState.clearHistory();
    this.currentChanged(updated);
  }

  render() {
    var schema = this.props.state.schema;
    var editorState = this.props.editorState || {};

    let exportSchema, exportSchemaName;
    if (this.state.exportDlgShow) {
      exportSchema = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(schema));
      exportSchemaName = schema.name + '.json';
    }
    return (
      <div className="index">

        <SplitPane split="vertical" minSize={80} defaultSize="65vw">
          <div>
            <Workplace schema={schema} current={this.state.current}
                       currentChanged={this.currentChanged.bind(this)} widgets={Widgets}
                       widgetRenderer={WidgetRenderer} snapGrid={this.state.snapGrid}/>
          </div>
          <div>
            <SplitPane split="horizontal" minSize={150} defaultSize="50vh">
              <div style={{width:'100%'}}>
                <div className="propertyBox header">
                  <button type="button" className="btn btn-primary navbar-btn"
                          onClick={() => this.setState({toolboxVisible: true})}>
                    <span className="glyphicon glyphicon-plus" title="preview"></span>
                  </button>
                  <button type="button" className="btn btn-primary navbar-btn"
                          onClick={() => this.setState({previewModalOpen: true})}>
                    <span className="glyphicon glyphicon-fullscreen" title="preview"></span>
                  </button>
                  <span>&nbsp;&nbsp;</span>
                  <button disabled={ editorState.canUndo } type="button"
                          className="btn btn-primary  navbar-btn"
                          onClick={editorState.undo}>
                    <span className="glyphicon glyphicon-arrow-left" title="undo"></span>
                  </button>
                  <button disabled={ editorState.canRedo } type="button"
                          className="btn btn-primary  navbar-btn"
                          onClick={editorState.redo}>
                    <span className="glyphicon glyphicon-arrow-right" title="redo"></span>
                  </button>
                  <span>&nbsp;&nbsp;</span>

                  <div className="pull-right">
										<span className="dropdown">
											<a href="#" className="dropdown-toggle" data-toggle="dropdown"
                         role="button"
                         aria-haspopup="true" aria-expanded="false">
												<span style={{fontSize:20,margin:5}} className="glyphicon glyphicon-th"
                              title="actions"></span>
											</a>
											<ul className="dropdown-menu">
												<li><a onClick={() => {this.setState({snapGrid:[1,1]})}}>0x0</a>
												</li>
												<li><a onClick={() => {this.setState({snapGrid:[5,5]})}}>5x5</a>
												</li>
												<li><a onClick={() => {this.setState({snapGrid:[10,10]})}}>10x10</a>
												</li>
												<li><a onClick={() => {this.setState({snapGrid:[20,20]})}}>20x20</a>
												</li>
												<li><a onClick={() => {this.setState({snapGrid:[50,50]})}}>50x50</a>
												</li>
											</ul>
										</span>
										<span className="dropdown">
											<a href="#" className="dropdown-toggle" data-toggle="dropdown"
                         role="button"
                         aria-haspopup="true" aria-expanded="false">
												<span style={{fontSize:20,margin:5}} className="glyphicon glyphicon-menu-hamburger"
                              title="actions"></span>
											</a>
											<ul className="dropdown-menu">
												<li><a onClick={()=> {this.setState({importDlgShow:true})}}>Import</a>
												</li>
												<li><a onClick={()=> {this.setState({exportDlgShow:true})}}>Export</a>
												</li>
												<li role="separator" className="divider"></li>
												<li><a onClick={this.props.editorState.publish}>Publish</a></li>
												<li role="separator" className="divider"></li>
												<li><a onClick={() => {this.setState({schemaOpen: true})}}>Schema</a></li>
												<li role="separator" className="divider"></li>
												<li><a onClick={() => this.props.editorState.generate('pdf')}>PDF</a></li>
												<li><a onClick={() => this.props.editorState.generate('jpg')}>JPG</a></li>
											</ul>
										</span>


                    <Toolbar current={this.state.current} currentChanged={this.currentChanged.bind(this)}/>

                  </div>
                </div>
                <div>
                  <ObjectPropertyGrid current={this.state.current} currentChanged={this.currentChanged.bind(this)}
                                      widgets={Widgets}/>
                </div>
              </div>
              <div>
                <div className="objectBrowser header"><h4>Component tree</h4></div>
                <ObjectBrowser rootNode={schema} current={this.state.current}
                               currentChanged={this.currentChanged.bind(this)}/>
              </div>
            </SplitPane>
          </div>
        </SplitPane>
        <Dock position='right' dimMode={this.state.toolboxPin?'none':'opaque'}
              isVisible={this.state.toolboxVisible}
              onVisibleChange={(isVisible) => this.setState({ toolboxVisible:isVisible })}>
          {/* you can pass a function as a child here */}
          <div>
            <FixedHeader>
              <div style={{float:'right'}}>
                <button type="button" className="btn btn-primary navbar-btn"
                        onClick={() => this.setState({ toolboxPin: !this.state.toolboxPin })}>
                  {this.state.toolboxPin ?
                    <span className="glyphicon glyphicon-paperclip" title="pin"/> :
                    <span className="glyphicon glyphicon-pushpin" title="pin"/>}
                </button>
                <button type="button" className="btn btn-primary navbar-btn"
                        onClick={() => this.setState({ toolboxVisible: !this.state.toolboxVisible })}>
														<span className="glyphicon glyphicon-remove-sign"
                                  title="close"></span>
                </button>

              </div>
              <h3>Components</h3>
            </FixedHeader>
            <div style={{paddingTop:60,paddingLeft:5}}>
              <ToolBox addCtrl={this.addNewItem.bind(this)}/>
            </div>
          </div>
        </Dock>
        <Modal show={this.state.previewModalOpen} onHide={()=>{	this.setState({previewModalOpen: false})}}
               style={ModalStyles.modalStyle} backdropStyle={ModalStyles.backdropStyle}>
          <div style={ModalStyles.dialogStyle}>
            <Preview
              widgets={Widgets}
              schema={schema}/>
          </div >
        </Modal>
        <FilePickerDialog show={this.state.importDlgShow} confirm={this.reloadSchema.bind(this)}
                          onHide={() => {this.setState({importDlgShow:false})}}/>

        <Modal show={this.state.exportDlgShow} onHide={()=>{	this.setState({exportDlgShow: false})}}
               style={ModalStyles.modalStyle} backdropStyle={ModalStyles.backdropStyle}>
          <div style={ModalStyles.dialogStyle}>
            <a href={exportSchema} download={exportSchemaName}>{exportSchemaName}</a>
          </div >
        </Modal>
      </div>

    );
  }
}
