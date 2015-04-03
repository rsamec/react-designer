var React = require('react');
var Freezer = require('freezer-js');
/****************
 JSON data to edit
 *****************/

var json = {'json':[]};

// Create a Freezer store
var frozenStore = new Freezer( json);


/****************
 Helper functions
 *****************/

// Guess the type given a value to create the proper attribute
var guessType = function( value ){
    var type = typeof value;

    if( type != 'object' )
        return type;

    if( value instanceof Array )
        return 'array';

    if( value instanceof Date)
        return 'date';

    return 'object';
};

// Default values to initialize attributes
var typeDefaultValues = {
    string: '',
    object: {},
    array: []
}

/**
 * Creates an specific attribute component depending on
 * the value given
 * @param  {Mixed} value    The value for the attribute
 * @param  {Mixed} original The value of the attribute on the original json
 * @param  {FreezerNode} parent   The parent node is needed to let the attribute update
 * @param  {String} key      The key for the attribute.
 * @return {ReactComponent}  A react component to edit the attribute.
 */
var createAttribute = function( value, original, parent, key ){
    var type = guessType( value );
    className = StringAttribute
    ;

    if( type == 'object' )
        className = ObjectAttribute;
    else if( type == 'array' )
        className = ArrayAttribute;

    if( typeof original == 'undefined' )
        original = typeDefaultValues[ type ];

    return React.createElement( className, {
        value: value,
        attrkey: typeof key != 'undefined' ? key : '',
        parent: parent,
        original: original
    });
};


/****************
 JSX components
 *****************/

/**
 * The main component. It will refresh the props when the store changes.
 *
 * @param  {FreezerNode} store  Freezer node that contains a json property with the data
 * @param  {FreezerNode} original Freezer node to compare with the current data
 */
var DocEditor = React.createClass({
    getInitialState: function(){
        return {
            storeHistory: [ this.props.store.get() ],
            currentStore: 0
        };
    },
    render: function(){
        var store = this.props.store.get(),
            disabledUndo = !this.state.currentStore,
            disabledRedo = this.state.currentStore == this.state.storeHistory.length - 1
            ;

        return (
            <div className="docEditor">
                <div className="storeHistory">
                    <button disabled={ disabledUndo } onClick={ this.undo }>Undo</button>
                    <button disabled={ disabledRedo } onClick={ this.redo }>Redo</button>
                </div>
                <pre>{ JSON.stringify( store.json, null, '  ')}</pre>
                <ObjectAttribute value={ store.json } original={ this.props.original.json }/>
            </div>
        );
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
                me.setState({
                    storeHistory: storeHistory,
                    currentStore: nextIndex
                });
            }
            else {
                // The change has been already triggered by the state
            }
        });
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
    }
});

/**
 * Attribute component that represent each Array element or Object property.
 * @param  {string} attrkey The key of the attribute in the parent.
 * @param  {Mixed} value The value of the attribute.
 * @param {Mixed} original The value of the attibute in the original json to highlight the changes.
 * @param {FreezerNode} parent The parent node to notify attribute updates.
 */
var Attribute = React.createClass({
    render: function(){
        var typeAttribute = createAttribute( this.props.value, this.props.original, this.props.parent, this.props.attrkey ),
            modifiedClass = this.props.value == this.props.original ? '' : ' modified',
            className = 'hashAttribute' + modifiedClass
            ;

        return (
            <div className={className}>
                <a href="#" className="attrRemove" onClick={ this.handleRemove }>[x]</a>
                <span className="attrName">{this.props.attrkey }:</span>
                <span className="attrValue">{ typeAttribute }</span>
            </div>
        );
    },

    handleRemove: function( e ){
        e.preventDefault();
        if( this.props.parent.constructor == Array )
            this.props.parent.splice( this.props.attrkey, 1 );
        else
            this.props.parent.remove( this.props.attrkey );
    },

    shouldComponentUpdate: function( nextProps, nextState ){
        return nextProps.value != this.props.value || nextProps.parent != this.props.parent;
    }
});

/**
 * Component for editing a hash.
 * @param  {FreezerNode} value The value of the object.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ObjectAttribute = React.createClass({
    getInitialState: function(){
        return { editing: false };
    },

    render: function(){
        var keys = Object.keys( this.props.value ),
            className = this.state.editing ? 'open objectAttr compoundAttr' : 'objectAttr compoundAttr',
            openHash = ''
            ;

        var attrs = [];
        for( var attr in this.props.value ){
            attrs.push(
                <Attribute
                    parent={ this.props.value }
                    value={this.props.value[attr]}
                    original={this.props.original[attr]}
                    key={ attr }
                    attrkey={ attr }
                />
            );
        }

        openHash = (<div className="attrChildren">
			{ attrs }
            <AttributeCreator type="attribute" parent={ this.props.value } />
        </div>);

        return (<span className={ className }>
            <span onClick={ this.toggleEditing } className="hashToggle">Map [{ keys.length }]</span>
				{openHash}
        </span>)
            ;
    },
    toggleEditing: function(){
        this.setState({ editing: !this.state.editing });
    }
});

/**
 * Component for editing an array.
 * @param  {FreezerNode} value The value of the array.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ArrayAttribute = React.createClass({
    getInitialState: function(){
        return { editing: false };
    },

    render: function(){
        var keys = Object.keys( this.props.value ),
            className = this.state.editing ? 'open arrayAttr compoundAttr' : 'arrayAttr compoundAttr',
            openArray = ''
            ;

        var attrs = [];
        for (var i = 0; i < this.props.value.length; i++) {
            attrs.push(
                <Attribute
                    parent={ this.props.value }
                    value={this.props.value[i]}
                    original={this.props.original[i]}
                    key={ i }
                    attrkey={ i }
                />
            );
        }

        openArray = (<div className="attrChildren">
			{ attrs }
            <AttributeCreator type="element" parent={ this.props.value } attrkey={ keys.length }/>
        </div>
        );

        return (<span className={ className }>
            <span onClick={this.toggleEditing} className="hashToggle">List [{keys.length}]</span>
				{openArray}
        </span>)
            ;
    },
    toggleEditing: function(){
        this.setState({editing: !this.state.editing});
    }
});

/**
 * Component for editing a string.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
var StringAttribute = React.createClass({
    getInitialState: function(){
        return {
            editing: !this.props.value,
            value: this.props.value
        };
    },

    render: function(){
        var className = 'stringAttr';
        if( this.props.value != this.props.original )
            className = ' modified';

        if( !this.state.editing )
            return <span onClick={ this.setEditMode } className={ className }>{ this.props.value }</span>;

        return <input value={ this.state.value } onChange={ this.updateValue } onBlur={ this.setValue } ref="input" onKeyDown={this.handleKeyDown} />;
    },

    componentDidUpdate: function( prevProps, prevState ){
        if( this.state.editing && ! prevState.editing ){
            var node = this.refs.input.getDOMNode();
            node.focus();
            node.value = node.value;
        }
    },

    componentDidMount: function(){
        if( this.state.editing ){
            var node = this.refs.input.getDOMNode();
            node.focus();
            node.value = node.value;
        }
    },

    setEditMode: function(){
        this.setState({editing: true});
    },

    setValue: function(){
        if( this.state.modified )
            this.props.parent.set( this.props.attrkey, this.state.value );

        this.setState({editing: false});
    },

    updateValue: function( e ){
        this.setState({value: e.target.value, modified: e.target.value != this.props.value });
    },

    handleKeyDown: function( e ){
        if( e.which == 13 )
            this.setValue();
    },
    toggleEditing: function(){
        this.setState({ editing: !this.state.editing });
    }
});

/**
 * Component to add attributes to a Hash or Array.
 * @param  {FreezerNode} root The parent to add the attribute.
 * @param  {string} attrkey Optional. If provided, the attribute added will have that key (arrays).
 *                           Otherwise an input will be shown to let the user define the key.
 */
var AttributeCreator = React.createClass({
    getInitialState: function(){
        return {
            creating: false,
            attrkey: this.props.attrkey,
            type: 'string'
        };
    },

    render: function(){
        if( !this.state.creating )
            return <a href="#" onClick={this.handleCreate}>+ Add {this.props.type}</a>;

        var attrName;
        if( typeof this.props.attrkey != 'undefined' )
            attrName =  <span className="attrName">{this.props.attrkey}:</span>;
        else {
            attrName = [
                <input ref="keyInput" type="text" value={this.state.value} onChange={this.changeKey}/>,
                <span>:</span>
            ];
        }

        return (<div className="hashAttribute">
				{ attrName }
            <select value={this.state.type} onChange={ this.changeType } ref="typeSelector">
                <option value="string">String</option>
                <option value="array">List</option>
                <option value="object">Map</option>
            </select>
            <button onClick={ this.createAttribute }>OK</button>,
            <a href="#" className="cancelAttr" onClick={ this.handleCancel }>Cancel</a>
        </div>);
    },

    componentDidUpdate: function( prevProps, prevState){
        if( !prevState.creating && this.state.creating ){
            if( this.refs.keyInput )
                this.refs.keyInput.getDOMNode().focus();
            else
                this.refs.typeSelector.getDOMNode().focus();
        }
    },

    componentWillReceiveProps: function( newProps ){
        this.setState({attrkey: newProps.attrkey});
    },

    handleCreate: function( e ){
        e.preventDefault();
        this.setState({creating: true});
    },

    handleCancel: function( e ){
        e.preventDefault();
        this.setState({creating: false});
    },

    changeType: function( e ){
        this.setState({type: e.target.value});
    },

    changeKey: function( e ){
        this.setState({attrkey: e.target.value});
    },

    createAttribute: function(){

        this.setState({creating: false});

        var parent = this.props.parent,
            value = typeDefaultValues[ this.state.type ]
            ;

        if( parent.constructor == Array )
            parent.push( value )
        else
            parent.set(this.state.attrkey, value );
    }
});

var JsonEditor = React.createClass({
    render: function(){
        return(<DocEditor store={ frozenStore } original={ frozenStore.get() } />);
    }
});


module.exports = JsonEditor;
