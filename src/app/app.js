'use strict';

var React = require('react');

//preview and container
var HtmlInputRenderer = require('./views/HtmlBootstrapRenderer');
var PDFRenderer = require('./views/PDFRenderer');
var HtmlRenderer = require('./views/HtmlRenderer');
var Container = require('./widgets/Container');

//editor components
var ToolBox = require('./components/ToolBox');
var ObjectBrowser = require('./components/ObjectBrowser');
var PrettyJson = require('./components/PrettyJson');
var MyPropertyGrid = require('./components/MyPropertyGrid');
var Tile = require('./components/Tile');

//bootstrap
var Modal = require('react-bootstrap').Modal;
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var MyModalTrigger = require('./components/MyModalTrigger');
var Button = require('react-bootstrap').Button;
var Panel = require('react-bootstrap').Panel;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;



var traverse = require('traverse');
var Freezer = require('freezer-js');
var idGenerator = require('./utilities/idGenerator');
var transformToPages = require('./utilities/transformToPages');

var emptyObjectSchema = {containers:[]};
// Create a Freezer store
var frozen = new Freezer(emptyObjectSchema);

var SplitPane = require('./react-split-pane/SplitPane');


var SaveAsDialog = React.createClass({
    getInitialState:function(){
        return {storageKey:this.props.storageKey};
    },
    onChange:function(e){
        this.setState({storageKey:e.target.value});
    },
    ok:function(e){
        this.props.confirm(this.state.storageKey);
        this.props.onRequestHide();
    },

    render: function() {
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
    getInitialState:function(){
        return {storageKey:this.props.storageKey};
    },
    onChange:function(e){
        this.setState({storageKey:e.target.value});
    },
    ok:function(e){
        this.props.confirm(this.state.storageKey);
        this.props.onRequestHide();
    },

    render: function() {
       var keys = [];
        for (var i=0;i !== localStorage.length;i++)
        {
            keys.push(localStorage.key(i));
        };
        var tiles = keys.map(function(key){return (
            <Tile>{key}</Tile>
        )});

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
    getInitialState:function(){
        return {storageKey:this.props.storageKey};
    },
    onChange:function(e) {

        var files = e.target.files; // FileList object
        var JsonObj;
        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    // Render thumbnail.
                    JsonObj = JSON.parse(e.target.result);
                    console.log(JsonObj);
                };
            })(f);
            // Read in the file as a data URL.
            reader.readAsText(f);
        }

        this.setState({storageKey: e.target.value});
    },
    ok:function(e){
        this.props.confirm(this.state.storageKey);
        this.props.onRequestHide();
    },

    render: function() {

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
    render: function() {
        var handleClick = function () {
            if (this.props.currentChanged !== undefined) this.props.currentChanged(this.props.store);
        }.bind(this);
        return (
            <div className="cWorkplace">
                    <Container
                        containers={this.props.store.containers}
                        boxes={this.props.store.boxes}
                        currentPropChanged={this.props.currentChanged}
                        current={this.props.current}
                        handleClick={handleClick}
                        isRoot={true}
                    />
            </div>
        );
    }
});

var ToolbarActions = React.createClass({
    up:function(){
        var store = this.props.store;
        var items = store.containers;
        var itemIndex = items.indexOf(this.props.current);
        var element = items[itemIndex];
        var toIndex = _.max([0,itemIndex -1]);

        items.splice(itemIndex,1).splice(toIndex, 0, element);
    },
    down:function(){
        var store = this.props.store;
        var items = store.containers;
        var itemIndex = items.indexOf(this.props.current);
        var element = items[itemIndex];
        var toIndex = _.min([items.length,itemIndex +1]);

        items.splice(itemIndex,1).splice(toIndex, 0, element);
    },
    removeCtrl:function(){
        if (this.props.current === undefined) return;
        var parent = this.findParent(this.props.store,this.props.current);
        if (parent === undefined) return;

        //try containers
        if (parent.containers !== undefined) {
            var index = parent.containers.indexOf(this.props.current);
            if (index !== -1) {
                parent.containers.splice(index, 1);
                return;
            }
        }

        //try boxes
        if (parent.boxes !== undefined) {
            index = parent.boxes.indexOf(this.props.current);
            if (index !== -1) {
                parent.boxes.splice(index, 1);
                return;
            }
        }
    },
    findParent:function(tree,node){
        var parents= traverse(tree).reduce(function (acc,x) {
            if (this.node === node) {
                acc.push(this.parent.parent.node);
            }
            return acc;
        },[]);
        return parents[0];
    },
    render: function() {
        var disabledCurrent = this.props.current === undefined;

        return (
            <div>
                <button disabled={ disabledCurrent } type="button" className="btn btn-primary" onClick={this.removeCtrl}>
                    <span className="glyphicon glyphicon-remove-sign"></span>
                </button>
                <button disabled={ disabledCurrent } type="button" className="btn btn-primary" onClick={this.up}>
                    <span className="glyphicon glyphicon-arrow-up"></span>
                </button>
                <button disabled={ disabledCurrent } type="button" className="btn btn-primary" onClick={this.down}>
                    <span className="glyphicon glyphicon-arrow-down"></span>
                </button>
            </div>
        );
    }
});


//Designer - top editor
var Designer =  React.createClass({
    getInitialState: function(){
        // We create a state with all the history
        // and the index to the current store
        return {
            storageKey:'Untitled document',
            storeHistory: [ this.props.store.get() ],
            currentStore: 0,
            jsonShown:false,
            toolboxShown:true

        };
    },
    getDefaultProps:function(){
      return {
          fakeData: {
              Employee: {FirstName: 'John', LastName: 'Smith'},
              Hobbies: [
                  {HobbyName: 'Bandbington', Frequency: 'Daily'},
                  {HobbyName: 'Tennis', Frequency: 'Yearly'},
                  {HobbyName: 'Reading', Frequency: 'Monthly'},
                  {HobbyName: 'Cycling', Frequency: 'Daily'}
                  ]
          }
      };
    },
    undo: function(){
        var nextIndex = this.state.currentStore - 1;
        this.props.store.set( this.state.storeHistory[ nextIndex ] );
        this.setState({ currentStore: nextIndex });
    },
    redo: function(){
        var nextIndex = this.state.currentStore + 1;
        this.props.store.set( this.state.storeHistory[ nextIndex ] );
        this.setState({ currentStore: nextIndex });
    },
    save:function(){
        localStorage.setItem(this.state.storageKey, JSON.stringify(this.props.store.get().toJS()))
    },
    saveAs:function(key) {
        console.log("Save" + key);
        localStorage.setItem(key, JSON.stringify(this.props.store.get().toJS()))
        this.setState({storageKey:key});
    },
    load:function(key){
        console.log("Load" + key);
        this.props.store.get().containers.reset((JSON.parse(localStorage.getItem(key))|| emptyObjectSchema).containers);
        this.setState({
                storeHistory: [ this.props.store.get() ],
                currentStore: 0,
                storageKey: key
            });
    },
    loadDialog:function(){
        return React.createElement(LoadDialog,{confirm:this.load, storageKey:this.state.storageKey});
    },
    saveDialog:function(){
        return React.createElement(SaveAsDialog,{confirm:this.saveAs,storageKey:this.state.storageKey});
    },
    setCurrentProps:function(currentValue){
        this.setState({currentValue:currentValue});
    },
    addNewCtrl:function(elName){
        var selectedContainer = this.state.currentValue;
        if (selectedContainer === undefined) return;
        if (elName === "Container" || elName === "Repeater") {
            var defaultSection = {
                name: "sec" + idGenerator.uniqueId() ,
                elementName: elName,
                style: {
                    top: 0,
                    left: 0,
                    height: 200,
                    width: 800,
                    position: 'relative'
                },
                boxes: [],
                containers: []
            };
            selectedContainer.containers.push(defaultSection);
        }
        else {
            var defaultBox = {
                name: elName.substr(3) + idGenerator.uniqueId(),
                elementName: elName,
                style: {
                    top: 0,
                    left: 0
                }
            };
            selectedContainer.boxes.push(defaultBox);
        }
    },
    handleTabChange: function(index){
        this.setState({
            tabActiveIndex: index
        })
    },
    switchWorkplace: function() {
        this.setState({jsonShown: !this.state.jsonShown});
    },
    switchToolbox: function() {
        this.setState({toolboxShown: !this.state.toolboxShown});
    },
    previewPdf:function() {

        //var fakeData = {Employee:{FirstName:'John'}};

        var defaultDocument = PDFRenderer.transformToPdf(this.props.store.get(),this.props.fakeData);
        hummusService.generatePDFDocument('http://pdfrendering.herokuapp.com', JSON.stringify(defaultDocument), function (url) {
            window.open(url);
        });

    },
    previewPdf2:function() {

        var schema = this.props.store.get();
        var pages = transformToPages(schema,this.props.fakeData);
        pdfKitService.generatePDFDocument('http://localhost:3000', JSON.stringify(pages), function (url) {
            window.open(url);
        });

    },
    componentDidMount: function(){
        var me = this;

        // We are going to update the props every time the store changes
        this.props.store.on('update', function( updated ){

            var storeHistory, nextIndex;
            // Check if this state has not been set by the history
            if( updated != me.state.storeHistory[ me.state.currentStore ] ){

                nextIndex = me.state.currentStore + 1;
                storeHistory = me.state.storeHistory.slice( 0, nextIndex );
                storeHistory.push( updated );

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
    handlePreview:function(e){
        console.log(e);
        if (e === "PdfHummus"){
            this.previewPdf();
        }else if (e === "PdfKit"){
            this.previewPdf2();
        }
        else{

        }
    },
    handleMenuClick:function(e) {
        console.log(e);
    },
    render:function(){
        var store = this.props.store.get(),
            disabledUndo = !this.state.currentStore,
            disabledRedo = this.state.currentStore == this.state.storeHistory.length - 1;
        var disabledSave = disabledUndo || this.state.storageKey===undefined;

        var toogleVisibleState = function(show) {
            var style= {}
            if (!show) {
                style.display = 'none'
            }
            return style;
        }
        return (

            <div>
                <SplitPane orientation="horizontal" minSize="80">
                    <div>
                        <div>
                            <button type="button" className="btn btn-primary" onClick={this.switchWorkplace}>
                                <span className="glyphicon glyphicon-transfer"></span>
                            </button>
                            &nbsp;&nbsp;
                            <button disabled={ disabledUndo } type="button" className="btn btn-primary" onClick={this.undo}>
                                <span className="glyphicon glyphicon-arrow-left"></span>
                            </button>
                            <button disabled={ disabledRedo } type="button" className="btn btn-primary" onClick={this.redo}>
                                <span className="glyphicon glyphicon-arrow-right"></span>
                            </button>
                            &nbsp;&nbsp;
                            <button disabled={ disabledSave } type="button" className="btn btn-primary" onClick={this.save}>
                                <span className="glyphicon glyphicon-floppy-disk"></span>
                            </button>
                            <ModalTrigger modal={this.loadDialog()}>
                                <button type="button" className="btn btn-primary">
                                    <span className="glyphicon glyphicon-floppy-open"></span>
                                </button>
                            </ModalTrigger>

                            &nbsp;&nbsp;
                            <MyModalTrigger modal={<HtmlInputRenderer data={store} />}>
                                <button type="button" className="btn btn-primary">
                                    <span className="glyphicon glyphicon-fullscreen"></span>
                                </button>
                            </MyModalTrigger>
                            <MyModalTrigger modal={<HtmlRenderer schema={store} data={this.props.fakeData} />}>
                                <button type="button" className="btn btn-primary">
                                    <span className="glyphicon glyphicon-star"></span>
                                </button>
                            </MyModalTrigger>

                            <ModalTrigger disabled={ disabledUndo }  modal={this.saveDialog()}>
                                <Button bsStyle='link'>{this.state.storageKey}</Button>
                            </ModalTrigger>

                            <DropdownButton className='pull-right' bsStyle='primary' title="Preview" onSelect={this.handlePreview}>
                                <MenuItem onClick={this.handleMenuClick} eventKey='Screen'>Screen</MenuItem>
                                <MenuItem eventKey='Page'>Page</MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey='PdfHummus'>PDF - Hummus</MenuItem>
                                <MenuItem eventKey='PdfKit'>PDF - PdfKit</MenuItem>
                            </DropdownButton>
                        </div>
                        <div>
                            <div style={toogleVisibleState(!this.state.jsonShown)}>
                                <Workplace store={store} current={this.state.currentValue} currentChanged={this.setCurrentProps}/>
                            </div>
                            <div style={toogleVisibleState(this.state.jsonShown)}>
                                <PrettyJson json={store} />
                            </div>
                        </div>

                    </div>
                    <div style={{'min-width':'300px'}}>
                        <div>
                            <div className='pull-right'>
                            <button type="button" className="btn btn-primary" onClick={this.switchToolbox}>
                                <span className="glyphicon glyphicon-transfer"></span>
                            </button>
                            </div>
                            <div>
                                <div style={toogleVisibleState(this.state.toolboxShown)}>
                                    <ToolbarActions store={store} current={this.state.currentValue} />
                                    <ObjectBrowser nodes={store.containers} current={this.state.currentValue} currentChanged={this.setCurrentProps}  />
                                    <MyPropertyGrid current={this.state.currentValue} currentChanged={this.setCurrentProps} />
                                </div>
                                <div style={toogleVisibleState(!this.state.toolboxShown)}>
                                    <ToolBox addCtrl={this.addNewCtrl} />
                                </div>
                            </div>
                        </div>
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
