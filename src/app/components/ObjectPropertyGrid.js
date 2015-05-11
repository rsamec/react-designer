'use strict';

var React = require('react');
var PropertyGrid = require('property-grid');
var pathObjecBinder = require('./../utilities/pathObjectBinder');
var deepClone = require('../utilities/deepClone');
var WidgetFactory = require('./WidgetFactory');



var ObjectPropertyGrid = React.createClass({
    currentProps:function(){
        if (this.props.current.node=== undefined) return [];
        return WidgetFactory.getWidgetProperties(this.props.current.node.elementName);
    },
    onPropertyValueChange: function(event, prop, value, path){

        //console.log(prop.name + ' has a new value: "' + value + '". Full path is ' + path.join('/'))
        if (prop.editor!== undefined && prop.editor.displayName === "BoolEditor"){
            value = event.target.checked?true:false;
        }

        if (prop.editor!== undefined && prop.editor.displayName === "NumberInputEditor"){
            value = value!==undefined?parseInt(value,10):0;
        }


        var current = this.props.current.node;
        var updated;
        if (path.length === 2){
            //TODO: find better way how to update nested properties
            var cloned = deepClone(current);
            var binder = new pathObjecBinder(function(){return cloned});
            var joinedPath = path[0].name + "." + path[1].name;
            binder.setValue(joinedPath,value);

            updated = current.set(cloned);
        }
        else{
            updated = current.set(prop.name, value);
        }
        this.props.currentChanged(updated);
    },
    render: function() {
        return (
            <div>
                <PropertyGrid
                    properties={this.currentProps()}
                    onChange={this.onPropertyValueChange}
                    autoUpdate={false}
                    value={this.props.current.node}
                >
                </PropertyGrid>
            </div>
        );
    }
});

module.exports = ObjectPropertyGrid;
