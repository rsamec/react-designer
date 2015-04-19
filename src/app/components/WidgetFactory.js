'use strict';

var React = require('react');

//editors
var numEditor = require('../editors/NumberInputEditor');
var BoolEditor = require('../editors/BoolEditor');
var JsonEditor = require('../editors/DocEditor');
var colorEditor = require('../editors/ColorPickerEditor');
var dropDownEditor = require('../editors/DropDownEditor');
var htmlEditor = require('../editors/HtmlEditor');

//widgets
var ReactBootstrap = require('react-bootstrap');
var ReactChartJs = require('react-chartjs');
var rd3 = require('react-d3');

var WidgetFactory = (function () {

    var widgets = {
        "TextBoxInput": require('../widgets/TextBoxInput'),
        "CheckBoxInput": require('../widgets/TextBoxInput'),
        "TextBox": require('../widgets/TextBox'),
        "ValueBox": require('../widgets/ValueBox'),
        "HtmlBox":require('../widgets/HtmlRenderer'),
        "TinyMceEditor":require('../widgets/HtmlRenderer'),
        "React.Griddle":require('griddle-react'),
        "ImageBox":require('../widgets/ImageBox')
    }

    var bootstrapWidgets =["Input","Button", "Panel","Glyphicon","Tooltip"];
    _.each(bootstrapWidgets,function(widgetName){
        var name = "ReactBootstrap." + widgetName;
        widgets[name] = ReactBootstrap[widgetName];
    });

    _.each(["Line","Bar","Radar","Polar","Pie","Doughnut"], function(name){
        widgets["ReactChartJs." + name] = ReactChartJs[name];
    });

    _.each(["LineChart","BarChart","AreaChart","Treemap","PieChart","ScatterChart","CandleStickChart"], function(name){
        widgets["ReactD3." + name] = rd3[name];
    });

    var getProperties = function() {

        var styleProps = {
            name: 'style',
            items: [
                {name: 'top',editor:numEditor},
                {name: 'left',editor:numEditor}]
        };
        var sizeProps = [
            {name: 'width', editor:numEditor},
            {name: 'height', editor:numEditor},
        ];

        var fontProps = {
            name: 'font',
            items: [
                {name: 'name'},
                {name: 'color', editor:colorEditor},
                {name: 'size', editor:numEditor},
                {name: 'bold', editor: BoolEditor},
                {name: 'italic', editor: BoolEditor},
                {name: 'underline', editor: BoolEditor}
            ]
        }

        var commonProps = [{name: 'name'},styleProps];
        var commonPropsSizes = [{name: 'name'},{
            name: 'style',
            items: styleProps.items.concat(sizeProps)
        }];

        var glyphs = ['asterisk','plus','euro','eur','minus'];
        var placement = ['left','right','bottom','top'];

        return {
            "Container":commonPropsSizes,
            "Repeater":commonPropsSizes.concat([{name:'Binding'}]),
            "CheckBoxInput":commonProps.concat([{name: 'checked',label: 'DefaultChecked', editor:numEditor},{name:'label'},{name:'Binding'}]),
            "TextBoxInput": commonProps.concat([{name:'value',label:'DefaultValue'},{name:'label'},{name:'Binding'}]),
            "TextBox": commonProps.concat([{name:'content'},fontProps]),
            "ValueBox":commonProps.concat([{name:'emptyValue'},{name:'Binding'},fontProps]),
            "ImageBox":commonProps.concat([{name:'url'},{name:'width',editor:numEditor},{name:'height',editor: numEditor}]),
            "ReactChartJs.Line":commonProps.concat([{name:'data',editor:JsonEditor},{name:'options',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor}]),
            "ReactChartJs.Bar":commonProps.concat([{name:'data',editor:JsonEditor},{name:'options',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor}]),
            "ReactChartJs.Radar":commonProps.concat([{name:'data',editor:JsonEditor},{name:'options',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor}]),
            "ReactChartJs.Polar":commonProps.concat([{name:'data',editor:JsonEditor},{name:'options',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor}]),
            "ReactChartJs.Pie":commonProps.concat([{name:'data',editor:JsonEditor},{name:'options',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor}]),
            "ReactChartJs.Doughnut":commonProps.concat([{name:'data',editor:JsonEditor},{name:'options',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor}]),
            "ReactD3.LineChart":commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            "ReactD3.ScatterChart":commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            "ReactD3.BarChart":commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            "ReactD3.AreaChart":commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            "ReactD3.PieChart":commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            "ReactD3.Treemap":commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            "HtmlBox":commonProps.concat([{name:'content',label:'Html', editor:htmlEditor},{name:'columnCount',editor:numEditor}]),
            "TinyMceEditor":commonProps.concat([{name:'content',label:'Html', editor:htmlEditor},{name:'columnCount',editor:numEditor}]),
            "React.Griddle":commonProps.concat([{name:'showFilter',editor: BoolEditor},{name:'showSettings',editor: BoolEditor},{name:'Binding'},{name:'results',editor:JsonEditor}]),
            "ReactBootstrap.Button":commonProps.concat([{name:'bsStyle'},{name:'bsSize'},{name:'content'}]),
            "ReactBootstrap.Input": commonProps.concat([{name:'type'},{name:'placeholder'},{name:'label'},{name:'help'},{name:'value'},{name:'Binding'}]),
            "ReactBootstrap.Panel": commonProps.concat([ {name:'number'}, {name:'header'}, {name:'content'}]),
            "ReactBootstrap.Glyphicon":commonProps.concat([{name:'glyph',editor:dropDownEditor, options:glyphs.map(function(g){ return {value:g,label:g}})}]),
            "ReactBootstrap.Tooltip":commonProps.concat([{name:'placement', editor:dropDownEditor,options:placement.map(function(x) {return {value:x,label:x}})}, {name:'positionLeft',editor:numEditor}, {name:'positionTop',editor:numEditor}, {name:'arrowOffsetLeft',editor:numEditor},{name:'arrowOffsetTop',editor:numEditor},{name:'content'}])
        }
    }

    var properties = getProperties();

    return {
        getWidgetProperties: function(name){
            var result = properties[name];
            return result!==undefined?result:[];
        },
        getWidgets:function(){
            return widgets;
        }
    }

})();

module.exports = WidgetFactory;
