import React from 'react';
import _ from 'lodash';
import Freezer from 'freezer-js';
import genie from 'genie';
import BindToMixin from 'react-binding';
import SplitPane from 'react-split-pane'

//bootstrap
import {Modal,ModalTrigger,Button,Panel,TabbedArea,TabPane} from 'react-bootstrap';

//menu
import {Menu,MainButton,ChildButton} from 'react-mfb'

//custom components
import ComponentMetaData from './components/ComponentMetaData.js';

var Widgets = require('./components/WidgetFactory');
var ToolBox = require('./components/ToolBox');
var ObjectBrowser = require('./components/ObjectBrowser');
var PrettyJson = require('./components/PrettyJson');
var ObjectPropertyGrid = require('./components/ObjectPropertyGrid');
var Tile = require('./components/Tile');
var If = require('./components/If');
var ModalViewTrigger = require('./components/ModalViewTrigger');
var ExampleList = require('./components/ExampleList');
var Container = require('./components/Container');

//utilities
var traverse = require('traverse');

var formService = require('./services/formService');

//dialogs
var FilePickerDialog = require('./dialogs/FilePickerDialog');
var SaveAsDialog = require('./dialogs/SaveAsDialog');
var LoadDialog = require('./dialogs/LoadDialog');

var Workplace = require('./components/Workplace');
var Preview = require('./components/Preview');


var emptyObjectSchema = {
    elementName: 'ObjectSchema',
    name: 'rootContainer',
    containers: [],
    data: {},
    props: {
        defaultData: {},
        dataSource: {
            type: 'template',
            template: {}
        }
    }
};


// Create a Freezer store
var frozen = new Freezer({schema: emptyObjectSchema});

var ToolbarActions = React.createClass({
    up: function () {
        var items = this.props.current.parentNode.containers;
        var itemIndex = items.indexOf(this.props.current.node);
        if (itemIndex === 0) return;

        var element = items[itemIndex];
        var toIndex = _.max([0, itemIndex - 1]);

        var updated = items.splice(itemIndex, 1).splice(toIndex, 0, element);
        this.props.currentChanged(updated[toIndex]);
    },
    down: function () {
        var items = this.props.current.parentNode.containers;
        var itemIndex = items.indexOf(this.props.current.node);
        if (itemIndex === items.length - 1) return;

        var element = items[itemIndex];
        var toIndex = _.min([items.length, itemIndex + 1]);

        var updated = items.splice(itemIndex, 1).splice(toIndex, 0, element);
        this.props.currentChanged(updated[toIndex]);
    },
    removeCtrl: function () {
        var current = this.props.current.node;
        if (current === undefined) return;
        var parent = this.props.current.parentNode;
        if (parent === undefined) return;

        var items = this.isContainer() ? parent.containers : parent.boxes;

        //remove selected item
        var index = items.indexOf(current);
        var updated = items.splice(index, 1);

        //set current
        if (index < items.length) {
            this.props.currentChanged(updated[index]);
        }

    },
    copy: function () {
        var current = this.props.current.node;
        if (current === undefined) return;
        var parent = this.props.current.parentNode;
        if (parent === undefined) return;

        //clone
        var clone = _.cloneDeep(current);
        clone.name = "Copy " + clone.name;


        var items = this.isContainer() ? parent.containers : parent.boxes;
        //add new cloned of selected item
        var updated = items.push(clone);

        //set current
        var index = items.indexOf(current);
        this.props.currentChanged(updated[index]);
    },

    isContainer: function () {
        return this.props.current.node !== undefined && (this.props.current.node.elementName === "Container" || this.props.current.node.elementName === "Repeater")
    },
    render: function () {
        var disabledCurrent = this.props.current.node === undefined || this.props.current.parentNode === undefined;
        var items = this.props.current.parentNode !== undefined ? this.props.current.parentNode.containers : [];
        var disabledMove = disabledCurrent || !this.isContainer() || items.lenght <= 1;

        //if first item - > disable
        var disabledUp = disabledMove || items.indexOf(this.props.current.node) === 0;
        //if last item -> disable
        var disabledDown = disabledMove || items.indexOf(this.props.current.node) === items.length - 1;

        return (
            <div>
                <button disabled={ disabledCurrent } type="button" className="btn btn-primary" onClick={this.copy}>
                    <span className="glyphicon glyphicon-copy" title="copy element"></span>
                </button>
                &nbsp;&nbsp;
                <button disabled={ disabledUp } type="button" className="btn btn-primary" onClick={this.up}>
                    <span className="glyphicon glyphicon-arrow-up" title="move up"></span>
                </button>
                <button disabled={ disabledDown } type="button" className="btn btn-primary" onClick={this.down}>
                    <span className="glyphicon glyphicon-arrow-down" title="move down"></span>
                </button>
                &nbsp;&nbsp;
                <button disabled={ disabledCurrent } type="button" className="btn btn-primary"
                        onClick={this.removeCtrl}>
                    <span className="glyphicon glyphicon-remove-sign" title="delete element"></span>
                </button>
            </div>
        );
    }
});

//Designer - top editor
var Designer = React.createClass({
    getInitialState: function () {
        // We create a state with all the history
        // and the index to the current store
        var store = this.props.store.get();
        return {
            storageKey: 'Untitled',
            storeHistory: [store],
            currentStore: 0,
            jsonShown: false,
            current: {
                node: store.schema
            }
        };
    },
    undo: function () {
        var nextIndex = this.state.currentStore - 1;
        this.props.store.set(this.state.storeHistory[nextIndex]);
        this.setState({currentStore: nextIndex});
    },
    redo: function () {
        var nextIndex = this.state.currentStore + 1;
        this.props.store.set(this.state.storeHistory[nextIndex]);
        this.setState({currentStore: nextIndex});
    },
    schema: function () {
        return this.props.store.get().schema;
    },
    schemaToJson: function () {
        return JSON.stringify(this.props.store.get().toJS().schema);
    },
    loadObjectSchema: function (objectSchema, key) {
        var store = this.props.store.get();
        var updated = store.schema.reset(objectSchema);
        this.currentChanged(updated);
        this.setState({storageKey: key});
        this.clearHistory();
    },
    clearHistory: function () {
        this.setState({
            storeHistory: [this.props.store.get()],
            currentStore: 0
        });
    },
    reset: function () {
        localStorage.removeItem(this.state.storageKey);
        this.loadObjectSchema(emptyObjectSchema, this.state.storageKey);
    },
    save: function () {
        localStorage.setItem(this.state.storageKey, this.schemaToJson());
        this.clearHistory();
    },
    saveAs: function (key) {
        localStorage.setItem(key, this.schemaToJson())
        this.setState({storageKey: key});
        this.clearHistory();
    },
    load: function (key) {
        this.loadObjectSchema(JSON.parse(localStorage.getItem(key)) || emptyObjectSchema, key)
    },

    loadDialog: function () {
        return React.createElement(LoadDialog, {confirm: this.load, storageKey: this.state.storageKey});
    },
    saveDialog: function () {
        return React.createElement(SaveAsDialog, {confirm: this.saveAs, storageKey: this.state.storageKey});
    },
    importDialog: function () {
        return React.createElement(FilePickerDialog, {
            confirm: this.loadObjectSchema,
            storageKey: this.state.storageKey
        });
    },
    currentChanged: function (currentNode) {
        var parent = currentNode.__.parents;
        var parentNode = parent.length !== 0 ? parent[0].__.parents[0] : undefined;
        this.setState({
                current: {
                    node: currentNode,
                    parentNode: parentNode
                }
            }
        );
    },
    addNewCtrl: function (elName) {
        var current = this.state.current.node;
        if (current === undefined) return;

        var isContainer = (elName === "Container" || elName === "Repeater");
        var items = isContainer ? current.containers : current.boxes;
        var defaultNewItem = isContainer ? {
            name: "container",
            elementName: elName,
            style: {
                top: 0,
                left: 0,
                height: 200,
                width: 740,
                position: 'relative'
            },
            props: ComponentMetaData[elName].metaData.props,
            boxes: [],
            containers: []
        }
            : {
            name: elName,
            elementName: elName,
            style: {
                top: 0,
                left: 0
            },
            props: Widgets[elName] && Widgets[elName].metaData.props || {}
        };

        var updated = items.push(defaultNewItem);
        this.currentChanged(updated[updated.length - 1]);
    },
    handleTabChange: function (index) {
        this.setState({
            tabActiveIndex: index
        })
    },
    switchWorkplace: function () {
        this.setState({jsonShown: !this.state.jsonShown});
    },
    handlePdfPreview: function (e) {
        if (e === "PdfHummus") {
            this.previewPdfHummus();
        } else if (e === "PdfKit") {
            this.previewPdfKit();
        }
        else {

        }
    },
    publish() {
        formService.publishSchema(this.props.store.get().toJS()).then(
            function (response) {
                alert('Schema publish successfully.' + response.saveLocation)
            },
            function (response) {
                alert('Schema publish failed.')
            }
        );
    },
    componentDidMount: function () {
        var me = this;

        // We are going to update the props every time the store changes
        this.props.store.on('update', function (updated) {

            var storeHistory, nextIndex;
            // Check if this state has not been set by the history
            if (updated != me.state.storeHistory[me.state.currentStore]) {

                nextIndex = me.state.currentStore + 1;
                storeHistory = me.state.storeHistory.slice(0, nextIndex);
                storeHistory.push(updated);

                // Set the state will re-render our component
                me.setState({
                    storeHistory: storeHistory,
                    currentStore: nextIndex
                });
            }
            else {
                // The change has been already triggered by the state, no need of re-render
            }
        });
        //var templateListener = this.schema().getListener();
        //
        //var lastDataSource = this.schema().props.dataSource;
        //templateListener.on('update', function (updated) {
        //    if (lastDataSource !== updated.props.dataSource) {
        //        updated.props.set("defaultData",genie(updated.props.dataSource.template));
        //    }
        //    lastDataSource = updated.props.dataSource;
        //});


    },
    render: function () {
        // demo defaults
        var effect = 'zoomin',
            pos = 'br',
            method = 'hover';

        var schema = this.schema(),
            disabledUndo = !this.state.currentStore,
            disabledRedo = this.state.currentStore == this.state.storeHistory.length - 1;
        var disabledSave = disabledUndo || this.state.storageKey === undefined;

        var toogleVisibleState = function (show) {
            var style = {}
            if (!show) {
                style.display = 'none'
            }
            return style;
        }
        var exportSchema = "data:text/json;charset=utf-8," + encodeURIComponent(this.schemaToJson());
        var exportSchemaName = this.state.storageKey + ".json";
        var displaySchemaName = this.state.storageKey
        if (!disabledUndo) displaySchemaName += ' *';


        return (
            <div>
                <Menu effect={effect} method={method} position={pos}>
                    <MainButton iconResting="ion-plus-round" iconActive="ion-close-round"/>

                    <ModalTrigger modal={this.loadDialog()}>
                        <ChildButton
                            icon="ion-ios-upload"
                            label="Open"
                            />
                    </ModalTrigger>
                    <ChildButton
                        onClick={this.save}
                        icon="ion-ios-download"
                        label="Save"
                        />
                    <ChildButton
                        onClick={this.publish}
                        icon="ion-share"
                        label="Publish"
                        />
                </Menu>
                <SplitPane split="vertical" minSize={80} defaultSize="70vw">
                    <div>
                        <div style={toogleVisibleState(!this.state.jsonShown)}>
                            <Workplace schema={schema} current={this.state.current}
                                       currentChanged={this.currentChanged}/>
                        </div>
                        <div style={toogleVisibleState(this.state.jsonShown)}>
                            <PrettyJson json={schema}/>
                        </div>
                    </div>
                    <div>
                        <SplitPane split="horizontal">
                            <div>
                                <nav className="navbar navbar-default navbar-fixed-top-custom">
                                    <ul className="nav navbar-nav">
                                        <li>
                                            <ToolbarActions current={this.state.current}
                                                            currentChanged={this.currentChanged}/>
                                        </li>
                                    </ul>
                                    <ul className="nav navbar-nav navbar-right">
                                        <li>
                                            <ModalTrigger disabled={ disabledUndo } modal={this.saveDialog()}>
                                                <Button bsStyle='link' title="save">
                                                    {displaySchemaName}
                                                </Button>
                                            </ModalTrigger>
                                        </li>
                                        <li>
                                            <button disabled={ disabledUndo } type="button" className="btn btn-primary"
                                                    onClick={this.undo}>
                                                <span className="glyphicon glyphicon-arrow-left" title="undo"></span>
                                            </button>
                                        </li>
                                        <li>
                                            <button disabled={ disabledRedo } type="button" className="btn btn-primary"
                                                    onClick={this.redo}>
                                                <span className="glyphicon glyphicon-arrow-right" title="redo"></span>
                                            </button>
                                        </li>


                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                               aria-expanded="false">
                                                <span className="glyphicon glyphicon-option-vertical"
                                                      aria-hidden="true"></span>
                                            </a>
                                            <ul className="dropdown-menu" role="menu">
                                                <li>
                                                    <ModalViewTrigger
                                                        modal={<Preview widgets={Widgets} schema={schema} />}>
                                                        <a>Preview</a>
                                                    </ModalViewTrigger>
                                                </li>
                                                <li>
                                                    <a onClick={this.switchWorkplace}>Switch</a>
                                                </li>

                                                <li className="divider"></li>
                                                <li>
                                                    <ModalTrigger modal={this.importDialog()}>
                                                        <a>Import schema</a>
                                                    </ModalTrigger>
                                                </li>
                                                <li>
                                                    <a href={exportSchema} download={exportSchemaName}>Export schema</a>
                                                </li>

                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                                <ObjectPropertyGrid current={this.state.current} currentChanged={this.currentChanged}/>
                            </div>
                            <div>
                                <TabbedArea defaultActiveKey={2}>
                                    <TabPane eventKey={1} tab='Tree'>
                                        <ObjectBrowser rootNode={schema} current={this.state.current}
                                                       currentChanged={this.currentChanged}/>
                                    </TabPane>
                                    <TabPane eventKey={2} tab='Pallete'>
                                        <ToolBox addCtrl={this.addNewCtrl}/>
                                    </TabPane>
                                    <TabPane eventKey={3} tab='Examples'>
                                        <ExampleList loadSchema={this.loadObjectSchema}/>
                                    </TabPane>
                                </TabbedArea>
                            </div>
                        </SplitPane>
                    </div>
                </SplitPane>
            </div>
        )
    }
});

React.render(
    <Designer store={ frozen } original={ frozen.get() }/>,
    document.getElementById('app')
);
