'use strict';

var React = require('react');

//preview and container
var PdfHummusRenderer = require('./views/PdfHummusRenderer');
var HtmlRenderer = require('./views/HtmlRenderer');

var Freezer = require('freezer-js');

//editor components
var ToolBox = require('./components/ToolBox');
var ObjectBrowser = require('./components/ObjectBrowser');
var PrettyJson = require('./components/PrettyJson');
var ObjectPropertyGrid = require('./components/ObjectPropertyGrid');
var Tile = require('./components/Tile');
var ModalViewTrigger = require('./components/ModalViewTrigger');

// components
var Container = require('./components/Container');
var WidgetFactory = require('./components/WidgetFactory');

//bootstrap
var bootstrap = require('react-bootstrap');
var Modal = bootstrap.Modal;
var ModalTrigger = bootstrap.ModalTrigger;
var Button = bootstrap.Button;
var Panel = bootstrap.Panel;
var DropdownButton = bootstrap.DropdownButton;
var MenuItem = bootstrap.MenuItem;
var TabbedArea = bootstrap.TabbedArea;
var TabPane = bootstrap.TabPane;

//utilities
var traverse = require('traverse');
var transformToPages = require('./utilities/transformToPages');
var deepClone = require('./utilities/deepClone');


var emptyObjectSchema = {
    elementName:'ObjectSchema',
    name:'rootContainer',
    containers: [],
    data: {
        Employee: {FirstName: 'John', LastName: 'Smith'},
        Hobbies: [
            {HobbyName: 'Bandbington', Frequency: 'Daily'},
            {HobbyName: 'Tennis', Frequency: 'Yearly'},
            {HobbyName: 'Reading', Frequency: 'Monthly'},
            {HobbyName: 'Cycling', Frequency: 'Daily'}
        ]
    }
};
// Create a Freezer store
var frozen = new Freezer({schema:emptyObjectSchema});

var SplitPane = require('./react-split-pane/SplitPane');

var SaveAsDialog = React.createClass({
    getInitialState: function () {
        return {storageKey: this.props.storageKey};
    },
    onChange: function (e) {
        this.setState({storageKey: e.target.value});
    },
    ok: function (e) {
        this.props.confirm(this.state.storageKey);
        this.props.onRequestHide();
    },

    render: function () {
        return (
            <Modal bsStyle="primary" title="Rename document" animation={false}>
                <div className="modal-body">
                    <input type="text" value={this.state.storageKey} onChange={this.onChange} />
                </div>
                <div className="modal-footer">
                    <Button onClick={this.ok}>OK</Button>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});

var LoadDialog = React.createClass({
    getInitialState: function () {
        return {storageKey: this.props.storageKey};
    },
    onChange: function (e) {
        this.setState({storageKey: e});
    },
    ok: function (e) {
        this.props.confirm(e);
        this.props.onRequestHide();
    },

    render: function () {
        var keys = [];
        for (var i = 0; i !== localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        ;
        var tiles = keys.map(function (key) {
            return (
                <Tile onClick={this.ok} eventKey={key}>{key}</Tile>
            )
        }, this);

        return (
            <Modal bsStyle="primary" title="Load document" animation={false}>
                <div className="modal-body">
                    <div>
                        {tiles}
                    </div>
                </div>
                <div className="modal-footer">
                    <Button onClick={this.ok}>OK</Button>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});

var FilePickerDialog = React.createClass({
    getInitialState: function () {
        return {
            storageKey: this.props.storageKey
        };
    },
    onChange: function (e) {

        var files = e.target.files; // FileList object

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {

            var parts = f.name.split(".");
            var fileName = parts[0];
            // Only process image files.
            if (parts[1] != 'json') {
                continue;
            }

            var reader = new FileReader();

            var self = this;
            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var objectSchema = JSON.parse(e.target.result);

                    self.setState({
                        storageKey:fileName,
                        objectSchema:objectSchema
                    });
                };
            })(f);
            // Read in the file as a data URL.
            reader.readAsText(f);
        }


    },
    ok: function (e) {
        if (this.state.objectSchema !== undefined) this.props.confirm(this.state.objectSchema, this.state.storageKey);
        this.props.onRequestHide();
    },
    render: function () {
        return (
            <Modal bsStyle="primary" title="File picker document" animation={false}>
                <div className="modal-body">
                    <input type="file" onChange={this.onChange} />


                </div>
                <div className="modal-footer">
                    <Button onClick={this.ok}>OK</Button>
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});

var Workplace = React.createClass({
    render: function () {
        var handleClick = function () {
            if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.schema);
        }.bind(this);
        var empty = this.props.schema.containers.length == 0;
        var component;
        //if (empty) {
        //    component = <div className='cContainer root'>Add container element to workplace - click on container in toolbox</div>
        //}
        //else {
            component =
                <Container
                    containers={this.props.schema.containers}
                    boxes={this.props.schema.boxes}
                    currentChanged={this.props.currentChanged}
                    current={this.props.current}
                    handleClick={handleClick}
                    isRoot={true} />
        //}

        return ( <div className="cWorkplace">{component}</div>);
    }
});

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
        var clone = deepClone(current);
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
                <button disabled={ disabledCurrent } type="button" className="btn btn-primary" onClick={this.removeCtrl}>
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
            storageKey: 'Untitled document',
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
    schema: function(){
        return this.props.store.get().schema;
    },
    schemaToJson:function(){
        return JSON.stringify(this.props.store.get().toJS().schema);
    },
    loadObjectSchema:function(objectSchema,key){
        var store = this.props.store.get();
        var updated = store.schema.reset(objectSchema);
        this.setState({
            storeHistory: [store],
            currentStore: 0,
            storageKey: key

        });
        this.currentChanged(updated);
    },

    reset: function () {
        localStorage.removeItem(this.state.storageKey);
        this.loadObjectSchema(emptyObjectSchema,this.state.storageKey);
    },
    save: function () {
        localStorage.setItem(this.state.storageKey, this.schemaToJson());
    },
    saveAs: function (key) {
        localStorage.setItem(key, this.schemaToJson())
        this.setState({storageKey: key});
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
        return React.createElement(FilePickerDialog, {confirm: this.loadObjectSchema, storageKey: this.state.storageKey});
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
            boxes: [],
            containers: []
        }
            : {
            name: elName,
            elementName: elName,
            style: {
                top: 0,
                left: 0
            }
        }
        //set default values
        if (!isContainer) {
            var widgetProps = WidgetFactory.getWidgetProperties(elName);
            for (var index in widgetProps) {
                var widget = widgetProps[index];
                if (widget.args !== undefined && widget.args.defaultValue !== undefined) defaultNewItem[widget.name] = widget.args.defaultValue;
            }
        }

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
    previewPdfHummus: function () {
        var schema = this.schema();
        var defaultDocument = PdfHummusRenderer.transformToPdf(schema, schema.data);
        hummusService.generatePDFDocument('http://pdfrendering.herokuapp.com', JSON.stringify(defaultDocument), function (url) {
            window.open(url);
        });
    },
    previewPdfKit: function () {
        var schema = this.schema();
        var pages = transformToPages(schema,schema.data);
        pdfKitService.generatePDFDocument('http://localhost:3000', JSON.stringify(pages), function (url) {
            window.open(url);3
        });
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
    },
    render: function () {

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
        return (
            <div>
                <SplitPane orientation="horizontal">
                    <div>
                        <div>
                            <button type="button" className="btn btn-primary" onClick={this.switchWorkplace}>
                                <span className="glyphicon glyphicon-transfer" title="toogle source and preview"></span>
                            </button>
                        &nbsp;&nbsp;
                            <button disabled={ disabledUndo } type="button" className="btn btn-primary" onClick={this.undo}>
                                <span className="glyphicon glyphicon-arrow-left" title="undo"></span>
                            </button>
                            <button disabled={ disabledRedo } type="button" className="btn btn-primary" onClick={this.redo}>
                                <span className="glyphicon glyphicon-arrow-right" title="redo"></span>
                            </button>
                        &nbsp;&nbsp;
                            <button disabled={ disabledSave } type="button" className="btn btn-primary" onClick={this.save}>
                                <span className="glyphicon glyphicon-floppy-disk" title="save"></span>
                            </button>
                            <ModalTrigger modal={this.loadDialog()}>
                                <button type="button" className="btn btn-primary">
                                    <span className="glyphicon glyphicon-floppy-open" title="open"></span>
                                </button>
                            </ModalTrigger>
                            <button disabled={ disabledSave } type="button" className="btn btn-primary" onClick={this.reset}>
                                <span className="glyphicon glyphicon-floppy-remove" title="reset document"></span>
                            </button>
                        &nbsp;&nbsp;
                            <ModalTrigger modal={this.importDialog()}>
                                <button type="button" className="btn btn-primary">
                                    <span className="glyphicon glyphicon-import" title="import"></span>
                                </button>
                            </ModalTrigger>
                            <a href={exportSchema} download={exportSchemaName}>
                                <button type="button" className="btn btn-primary">
                                    <span className="glyphicon glyphicon-export" title="export"></span>
                                </button>
                            </a>
                        &nbsp;&nbsp;


                            <ModalTrigger disabled={ disabledUndo }  modal={this.saveDialog()}>
                                <Button bsStyle='link' title="save">{this.state.storageKey}</Button>
                            </ModalTrigger>

                            <div className="pull-right">
                                <DropdownButton bsStyle='primary' title="PDF" onSelect={this.handlePdfPreview}>
                                    <MenuItem eventKey='PdfKit'>PdfKit</MenuItem>
                                    <MenuItem eventKey='PdfHummus'>Hummus</MenuItem>
                                </DropdownButton>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                                <ModalViewTrigger  modal={<HtmlRenderer schema={schema} data={schema.data} />}>
                                    <button type="button" className="btn btn-primary">
                                        <span className="glyphicon glyphicon-fullscreen"></span>
                                    </button>
                                </ModalViewTrigger>
                            </div>
                        </div>
                        <div>
                            <div style={toogleVisibleState(!this.state.jsonShown)}>
                                <Workplace schema={schema} current={this.state.current} currentChanged={this.currentChanged}/>
                            </div>
                            <div style={toogleVisibleState(this.state.jsonShown)}>
                                <PrettyJson json={schema} />
                            </div>
                        </div>

                    </div>
                    <div style={{'minWidth': 300}}>
                        <SplitPane orientation="vertical">
                            <div>
                                <div className='topRightFixed'>
                                    <ToolbarActions current={this.state.current}  currentChanged={this.currentChanged} />
                                </div>
                                <div className='topRight'>

                                    <ObjectPropertyGrid current={this.state.current} currentChanged={this.currentChanged} />
                                </div>
                            </div>
                            <div>
                                <TabbedArea defaultActiveKey={2}>
                                    <TabPane eventKey={1} tab='Tree'>
                                        <ObjectBrowser rootNode={schema} current={this.state.current} currentChanged={this.currentChanged}  />
                                    </TabPane>
                                    <TabPane eventKey={2} tab='Pallete'>
                                        <ToolBox addCtrl={this.addNewCtrl} />
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
