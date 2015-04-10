var React = require('react');
var PropertyGrid = require('property-grid');
var PathObjecBinder = require('./../utilities/pathObjectBinder');
var deepClone = require('../utilities/deepClone');
var WidgetFactory = require('./WidgetFactory');

var MyPropertyGrid = React.createClass({
    currentProps:function(){
        if (this.props.current=== undefined) return [];
        return WidgetFactory.getWidgetProperties(this.props.current.elementName);
    },
    onPropertyValueChange: function(event, prop, value, path){

        //console.log(prop.name + ' has a new value: "' + value + '". Full path is ' + path.join('/'))
        if (prop.editor!== undefined && prop.editor.displayName === "BoolEditor"){
            value = event.target.checked?true:false;
        }

        var current = this.props.current;
        var updated;
        if (path.length === 2){
            var cloned = deepClone(current);
            var binder = new PathObjecBinder(function(){return cloned});
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
                    value={this.props.current}
                >
                </PropertyGrid>
            </div>
        );
    }
});

module.exports = MyPropertyGrid;
