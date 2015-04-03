var React = require('react');

//preview and container
var Preview = require('./views/HtmlBootstrapRenderer');
var Container = require('./widgets/Container');

//editor components
var ToolBox = require('./components/ToolBox');
var ObjectBrowser = require('./components/ObjectBrowser');
var PrettyJson = require('./components/PrettyJson');
var TinyMceEditor = require('./components/TinyMceEditor');
var MyPropertyGrid = require('./components/MyPropertyGrid');

//bootstrap
var Modal = require('react-bootstrap').Modal;
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var MyModalTrigger = require('./components/MyModalTrigger');
var Button = require('react-bootstrap').Button;

var TabPanel = require('react-tab-panel');

var traverse = require('traverse');
var Freezer = require('freezer-js');
var Util = require('./components/Util');

var emptyObjectSchema = {containers:[]};
// Create a Freezer store
var frozen = new Freezer(emptyObjectSchema);


var HtmlEditorModal = React.createClass({
    render: function() {
        return (
            <Modal bsStyle="primary" title="Modal heading" animation={false}>
                <div className="modal-body">
                    <TinyMceEditor {...this.props} />
                </div>
                <div className="modal-footer">
                    <Button onClick={this.props.onRequestHide}>Close</Button>
                </div>
            </Modal>
        );
    }
});
var InputDialog = React.createClass({
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
            <Modal bsStyle="primary" title="Modal heading" animation={false}>
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

var PreviewModal = React.createClass({
    render: function() {
        return (
            <Modal bsStyle="primary" title="Modal heading" animation={false}>
                <div className="modal-body modal-lg">
                   <Preview data={this.props.data} />
                </div>
                <div className="modal-footer">
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
                <Container tinyMceEditor={this.props.htmlEditor}
                    containers={this.props.store.containers}
                    boxes={this.props.store.boxes}
                    currentPropChanged={this.props.currentChanged}
                    current={this.props.current}
                    handleClick={handleClick}
                    height="100%"
                    width="100%"
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
                <MyModalTrigger>
                    <Preview data={this.props.store} />
                </MyModalTrigger>
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
            storageKey:'print',
            storeHistory: [ this.props.store.get() ],
            currentStore: 0,
            tabActiveIndex: 0

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
        return React.createElement(InputDialog,{confirm:this.load, storageKey:this.state.storageKey});
    },
    saveDialog:function(){
        return React.createElement(InputDialog,{confirm:this.saveAs,storageKey:this.state.storageKey});
    },
    setCurrentProps:function(currentValue){
        this.setState({currentValue:currentValue});
    },
    addNewCtrl:function(elName){
        var selectedContainer = this.state.currentValue;
        if (selectedContainer === undefined) return;
        if (elName === "Container") {
            var defaultSection = {
                name: "sec" + Util.uniqueId() ,
                elementName: 'Container',
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
                name: elName.substr(3) + Util.uniqueId(),
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
    render:function(){
        var store = this.props.store.get(),
            disabledUndo = !this.state.currentStore,
            disabledRedo = this.state.currentStore == this.state.storeHistory.length - 1;
        var disabledSave = disabledUndo || this.state.storageKey===undefined;

        return (
            <div>
                <div className="row">
                    <div className="col-md-9">
                        <Workplace store={store} current={this.state.currentValue} currentChanged={this.setCurrentProps} htmlEditor={HtmlEditorModal} />
                    </div>

                    <div className="col-md-3">
                        <div>
                        {this.state.storageKey}
                            <button disabled={ disabledUndo } type="button" className="btn btn-primary" onClick={this.undo}>
                                <span className="glyphicon glyphicon-arrow-left"></span>
                            </button>
                            <button disabled={ disabledRedo } type="button" className="btn btn-primary" onClick={this.redo}>
                                <span className="glyphicon glyphicon-arrow-right"></span>
                            </button>
                            <button disabled={ disabledSave } type="button" className="btn btn-primary" onClick={this.save}>
                                <span className="glyphicon glyphicon-floppy-disk"></span>
                            </button>
                            <ModalTrigger modal={this.loadDialog()}>
                                <button type="button" className="btn btn-primary">
                                    <span className="glyphicon glyphicon-floppy-open"></span>
                                </button>
                            </ModalTrigger>
                            <ModalTrigger modal={this.saveDialog()}>
                                <button disabled={ disabledUndo } type="button" className="btn btn-primary">
                                    <span className="glyphicon glyphicon-floppy-save"></span>
                                </button>
                            </ModalTrigger>
                        </div>
                        <ToolbarActions store={store} current={this.state.currentValue} />
                        <TabPanel activeIndex={this.state.tabActiveIndex}
                            onChange={this.handleTabChange}
                            titleStyle={{padding: 10}}>
                            <div title="Objects">
                                <div>
                                    <ObjectBrowser nodes={store.containers} current={this.state.currentValue} currentChanged={this.setCurrentProps}  />

                                    <MyPropertyGrid current={this.state.currentValue} currentChanged={this.setCurrentProps} />
                                </div>
                            </div>
                            <div title="Toolbox">
                                <ToolBox addCtrl={this.addNewCtrl} />
                            </div>
                            <div title="Json">
                                <PrettyJson json={this.state.currentValue} />
                            </div>
                        </TabPanel>
                    </div>
                </div>
            </div>
        )
    }
});

React.render(
    <Designer store={ frozen } original={ frozen.get() }/>,
    document.getElementById('app')
);
