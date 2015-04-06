var React = require('react');
var PropertyGrid = require('property-grid');
var NumberInputEditor = require('./NumberInputEditor');
var JsonEditor = require('./DocEditor');

var MyPropertyGrid = React.createClass({
    getPropertyGridProps:function() {

        if (this.props.current === undefined) {
            return [];
        }

        var styleProps = {
            name: 'style',
            items: [{name: 'top'},{name: 'left'}]
        };
        var sizeProps = [
            {name: 'width'},
            {name: 'height'},
            {name: 'position'}
        ];
        var stylePropsWithSizes = {
            name: 'style',
            items:styleProps.items.concat(sizeProps)
        }



        var commonProps = [{name: 'name'},styleProps];
        var commonPropsSizes = [{name: 'name'},stylePropsWithSizes];

        var bootStrapProps = {
            Panel:[
                {name:'number',
                 editor:NumberInputEditor},
                {name:'header'},
                {name:'content'}],
            Input:[
                {name:'type'},
                {name:'placeholder'},
                {name:'label'},
                {name:'help'},
                {name:'value'},
                {name:'Binding'}
            ],
            Button:[
                {name:'bsStyle'},
                {name:'bsSize'},
                {name:'content'}
            ],
            Glyphicon:[
                {name:'glyph'}
            ],
            Tooltip:[
                {name:'placement'},
                {name:'positionLeft'},
                {name:'positionTop'},
                {name:'arrowOffsetLeft'},
                {name:'arrowOffsetTop'},
                {name:'content'}

            ]





        }

        var elName = this.props.current.elementName;

        switch (elName){
            case "Container":
                return commonPropsSizes;
            case "CheckBoxInput":
                commonProps.push({
                    name:'checked',
                    label:'DefaultChecked'
                });
                commonProps.push({name:'label'});
                commonProps.push({name:'Binding'});
                break;
            case "TextBoxInput":
                commonProps.push({
                    name:'value',
                    label:'DefaultValue'
                });
                commonProps.push({name:'label'});
                commonProps.push({name:'Binding'});
                break;
            case "TextBox":
                commonProps.push({name:'content'});
                break;
            case "ValueBox":
                commonProps.push({name:'emptyValue'});
                commonProps.push({name:'Binding'});
                break;
            case "TinyMceEditor":
                commonProps.push({
                    name:'content',
                    label:'Html'
                });
                break;
            case "React.Griddle":
                commonProps.push(
                    {name:'showFilter'});
                commonProps.push({name:'showSettings'});
                commonProps.push({name:'Binding'});
                commonProps.push(
                    {name:'results',editor:JsonEditor});

                break;
            case "ReactBootstrap.Button":
                return commonProps.concat(bootStrapProps.Button);
            case "ReactBootstrap.Input":
                return commonProps.concat(bootStrapProps.Input);
            case "ReactBootstrap.Panel":
                return commonProps.concat(bootStrapProps.Panel);
            case "ReactBootstrap.Glyphicon":
                return commonProps.concat(bootStrapProps.Glyphicon);
            case "ReactBootstrap.Tooltip":
                return commonProps.concat(bootStrapProps.Tooltip);

        }
        return commonProps;
    },
    onPropertyValueChange: function(event, prop, value, path){
        //path = path.map(function(prop){
        //    return prop.name
        //})
        console.log(prop.name + ' has a new value: "' + value + '". Full path is ' + path.join('/'))
        var current = this.props.current;
        var updated;
        if (path.length === 2){
            var obj = {}
            obj[path[0].name] = _.clone(current[path[0].name]);
            obj[path[0].name][prop.name] = value;
            updated = current.set(obj);
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
                    properties={this.getPropertyGridProps()}
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
