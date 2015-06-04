'use strict';

var React = require('react');

//editors
var numEditor = require('../editors/NumberInputEditor');
var BoolEditor = require('../editors/BoolEditor');
var JsonEditor = require('../editors/DocEditor');
var colorEditor = require('../editors/ColorPickerEditor');
var dropDownEditor = require('../editors/DropDownEditor');
var htmlEditor = require('../editors/HtmlEditor');
var codeMirrorEditor = require('../editors/CodeMirrorEditor');
var bindEditor = require('../editors/BindingEditor');

//external widgets with more controls
var ReactBootstrap = require('react-bootstrap');
var rd3 = require('react-d3');
var Griddle = require('griddle-react');
var ChartistGraph = require('react-chartist');

var Shapes = require('../widgets/Shapes');

var WidgetFactory = (function () {

    var widgets = {
        'TextBoxInput': require('../widgets/TextBoxInput'),
        'CheckBoxInput': require('../widgets/CheckBoxInput'),
        'TextBox': require('../widgets/TextBox'),
        'ValueBox': require('../widgets/ValueBox'),
        'HtmlBox':require('../widgets/HtmlRenderer'),
        'ImageBox':require('../widgets/ImageBox'),
        'Flipper':require('../widgets/Flipper'),
        'JSXBox':require('../widgets/JSXBox'),
        'ImagePanel':require('../widgets/ImagePanel'),

        'react-pivot':require('../widgets/PivotTable'),
        'ChartistGraph':require('../widgets/ChartistGraph'),

        'React.Griddle':Griddle,
        'react-inlinesvg':require('react-inlinesvg'),
        'react-3d-carousel':require('react-3d-carousel'),

        //'SnapSvgBox':require('../widgets/SnapSvgBox')
        //'Reacticon':require('../../../node_modules/reacticons/src/scripts/components/reacticon')
    }

    _.each(['Rectangle','Circle', 'Ellipse','Line','Polyline','CornerLine','CornerBox'], function(name){
        widgets['Shapes.' + name] = Shapes[name];
    });

    var bootstrapWidgets =['Input','Button', 'Panel','Glyphicon','Tooltip','Alert','Label'];
    _.each(bootstrapWidgets,function(widgetName){
        var name = 'ReactBootstrap.' + widgetName;
        widgets[name] = ReactBootstrap[widgetName];
    });



    var getProperties = function() {

        var styleProps = {
            name: 'style',
            items: [
                {name: 'top',editor:numEditor},
                {name: 'left',editor:numEditor}]
        };
        var sizeProps = [
            {name: 'width', editor:numEditor,args:{defaultValue:300}},
            {name: 'height', editor:numEditor,args:{defaultValue:100}},
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
        var typeOptions = ['text','table','image','code','slides'];
        var bsStyles = ['default','primary','success','info','warning','danger'];
        var bsSizes = ['large','medium','small','xsmall'];
        var orientation = ['horizontal','vertical'];

        var bsStyle = {name:'bsStyle',editor:dropDownEditor, args:{options:bsStyles.map(function(g){ return {value:g,label:g}})}};
        var content = {name:'content',args:{defaultValue:'type your content'}};
        var bsSize = {name:'bsSize',editor:dropDownEditor, args:{options:bsSizes.map(function(g){ return {value:g,label:g}}),defaultValue:'medium'}}
        var numEditorFce = function(name,defaultVal) {
            //if (defaultVal === undefined) defaultVal = 100;
            return {name: name, editor: numEditor, args: {defaultValue: defaultVal}};
        };

        var defaultImg = "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
        var bindEditorFce = function(name, twoWayBindingMode,converter) {
            var result = {name: name, editor: bindEditor};
            if (!!twoWayBindingMode) result.args = {bindingMode:'TwoWay'};
            if (!!converter) result.args = {converter:converter};
            return result;
        };
        var stroke = {name:'stroke', editor:colorEditor,args:{defaultValue:'black'}};
        var fill = {name:'fill', editor:colorEditor,args:{defaultValue:'none'}}
        var strokeWidth = numEditorFce('strokeWidth',2);

        var shapeProps = [stroke,fill,strokeWidth];

        var cornerBoxOrientation  ={name: 'orientation', editor:dropDownEditor, args:{options: ['topRight','topLeft','bottomRight','bottomLeft'].map(function(g){ return {value:g,label:g}}),defaultValue:'topLeft'}};
        var imgAlign  ={name: 'imageAlign', editor:dropDownEditor, args:{options: ['topRight','topLeft','bottomRight','bottomLeft'].map(function(g){ return {value:g,label:g}}),defaultValue:'topRight'}};
        return {
            'ObjectSchema':[{name:'name'},{name:'data',editor:JsonEditor},{name:'businessRules',editor:JsonEditor},{name:'title'},{name:'input',editor:BoolEditor }],
            'Container':commonPropsSizes.concat([bindEditorFce('Visibility'), {name: 'startOnNewPage', editor:BoolEditor},{name: 'unbreakable', editor:BoolEditor}]),
            'Repeater':commonPropsSizes.concat([bindEditorFce('Binding')]),
            'CheckBoxInput':commonProps.concat([bindEditorFce('checked',true), {name: 'defaultChecked', editor:BoolEditor},{name:'label', args:{defaultValue:'Label'}}]),
            'TextBoxInput': commonProps.concat([bindEditorFce('value',true), {name:'defaultValue'},{name:'label',args:{defaultValue:'Label'}}]),
            'CollapsibleTree': commonProps.concat([{name:'title'},bindEditorFce('data')]),
            'TextBox': commonProps.concat([{name:'content', args:{defaultValue:'Type your text'}},fontProps]),
            'Flipper': commonProps.concat([{name:'width',editor:numEditor, args:{defaultValue:200}},{name:'height',editor: numEditor,args:{defaultValue:200}},{name: 'orientation', editor:dropDownEditor, args:{options:orientation.map(function(g){ return {value:g,label:g}}),defaultValue:'horizontal'}},
                {name:'front', args:{defaultValue:'front text'}},{name: 'frontColor', editor:colorEditor,args:{defaultValue:'#19489E'}},{name:'back', args:{defaultValue:'back text'}},{name: 'backColor', editor:colorEditor,args:{defaultValue:'#9E1919'}},fontProps]),
            'JSXBox': commonProps.concat([{name:'content', editor:codeMirrorEditor, args:{defaultValue:'return <div>Type your code</div>'}},bindEditorFce('Binding')]),
            'ValueBox':commonProps.concat([{name:'emptyValue',args:{defaultValue:'---'}},bindEditorFce('content'),fontProps]),
            'ImageBox':commonPropsSizes.concat([{name:'url',args:{defaultValue:defaultImg}},numEditorFce('radius')]),
            'ImagePanel':commonPropsSizes.concat([{name:'imageUrl',args:{defaultValue:defaultImg}},imgAlign,numEditorFce('imageWidth'),numEditorFce('imageHeight'),numEditorFce('imageRadius'),numEditorFce('imageMargin'),{name:'content',label:'Html', editor:htmlEditor,args:{defaultValue:'Type your content'}},{name:'roundCorner',editor:BoolEditor},numEditorFce('borderWidth',2),numEditorFce('padding'),{name: 'bgColor', editor:colorEditor}, {name: 'color', editor:colorEditor}]),
            'ReactD3.LineChart':commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            'ReactD3.ScatterChart':commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            'ReactD3.BarChart':commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            'ReactD3.AreaChart':commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            'ReactD3.PieChart':commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            'ReactD3.Treemap':commonProps.concat([{name:'data',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'title'}]),
            'ChartistGraph':commonProps.concat([bindEditorFce('data'),{name:'options',editor:JsonEditor},{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'type', editor:dropDownEditor,args:{options:['Line','Bar','Pie'].map(function(x) {return {value:x,label:x}}),defaultValue:'Line'}}]),

            'HtmlBox':commonProps.concat([{name:'content',label:'Html', editor:htmlEditor,args:{defaultValue:'Type your content'}},{name:'columnCount',editor:numEditor},{name:'counterReset',editor:numEditor}]),
            'TinyMceEditor':commonProps.concat([{name:'content',label:'Html', editor:htmlEditor},{name:'columnCount',editor:numEditor}]),
            'React.Griddle':commonProps.concat([{name:'showFilter',editor: BoolEditor},{name:'showSettings',editor: BoolEditor},{name:'noDataMessage'},{name:'columns',editor:JsonEditor},{name:'columnMetadata',editor:JsonEditor},{name:'enableInfiniteScroll',editor:BoolEditor},{name:'useFixedHeader ',editor:BoolEditor},numEditorFce('bodyHeight',400),bindEditorFce('results')]),
            'ReactBootstrap.Button':commonProps.concat([bsStyle,bsSize, content,bindEditorFce('onAdd'), bindEditorFce('onRemove')]),
            'ReactBootstrap.Input': commonPropsSizes.concat([{name:'type',args:{defaultValue:'text'}},{name:'placeholder',args:{defaultValue:'type your text'}},{name:'label',args:{defaultValue:'Label'}},{name:'help'},bindEditorFce('value',true)]),
            'ReactBootstrap.Panel': commonProps.concat([ {name:'number'}, {name:'header',args:{defaultValue:'Header'}}, content]),
            'ReactBootstrap.Glyphicon':commonProps.concat([{name:'glyph',editor:dropDownEditor, args:{options:glyphs.map(function(g){ return {value:g,label:g}}),defaultValue:'asterisk'}}]),
            'ReactBootstrap.Alert':commonProps.concat([bsStyle,content]),
            'ReactBootstrap.Label':commonProps.concat([bsStyle, bsSize,content]),
            'ReactBootstrap.Tooltip':commonProps.concat([{name:'placement', editor:dropDownEditor,args:{options:placement.map(function(x) {return {value:x,label:x}})}}, {name:'positionLeft',editor:numEditor}, {name:'positionTop',editor:numEditor}, {name:'arrowOffsetLeft',editor:numEditor},{name:'arrowOffsetTop',editor:numEditor},{name:'content'}]),
            'react-inlinesvg':commonProps.concat([{name: 'src',args:{defaultValue:'http://upload.wikimedia.org/wikipedia/commons/8/8a/Bicycle_diagram-en.svg'}}]),
            'react-3d-carousel':commonProps.concat([{name:'width', editor:numEditor, args:{defaultValue:200}},{name:'images',editor:JsonEditor,args:{defaultValue:[]}},{name:'duration', editor:numEditor, args:{defaultValue:250}},{name:'layout',editor:dropDownEditor, args:{options:['prism','classic'].map(function(g){ return {value:g,label:g}}),defaultValue:'prism'}}]),
            //'SnapSvgBox':commonPropsSizes.concat([{name:'width',editor:numEditor},{name:'height',editor: numEditor},{name:'headline'},{name:'htmlRibbonText'},{name:'cssRibbonText'},{name:'jsRibbonText'}]),
            'Shapes.Rectangle':commonPropsSizes.concat([numEditorFce('x'), numEditorFce('y')]).concat(shapeProps),
            'Shapes.Circle':commonPropsSizes.concat([numEditorFce('cx',50), numEditorFce('cy',50),numEditorFce('r',25)]).concat(shapeProps),
            'Shapes.Ellipse':commonPropsSizes.concat([numEditorFce('cx',50), numEditorFce('cy',50),numEditorFce('rx',25), numEditorFce('ry',15)]).concat(shapeProps),
            'Shapes.Line':commonPropsSizes.concat([numEditorFce('x1',25), numEditorFce('y1',25),numEditorFce('x2',75), numEditorFce('y2',75)]).concat(shapeProps),
            'Shapes.Polyline':commonPropsSizes.concat([{name:'points', args:{defaultValue:'25,25 25,75 50,75 50,50 75,25'}}]).concat(shapeProps),
            'Shapes.CornerLine':commonPropsSizes.concat([numEditorFce('x',25), numEditorFce('y',25),numEditorFce('size',150), numEditorFce('width',50),{name:'text'},{name: 'up', editor: BoolEditor}]).concat(shapeProps),
            'Shapes.CornerBox':commonPropsSizes.concat([numEditorFce('size',150), numEditorFce('width',50),{name:'text'},cornerBoxOrientation]).concat(shapeProps),
            'react-pivot':commonProps.concat([bindEditorFce('rows'),bindEditorFce('dimensions'),{name:'reduce',editor: codeMirrorEditor},{name:'calculations',editor: codeMirrorEditor},{name:'nPaginateRows',editor: numEditor,args:{defaultValue:10}}])
            //'Reacticon':commonProps.concat([{name: 'height', editor:numEditor},{name: 'width', editor:numEditor},{name: 'type', editor:dropDownEditor,options:typeOptions.map(function(g){ return {value:g,label:g}})},{name:'label'}, {name: 'bgColor', editor:colorEditor}, {name: 'primaryColor', editor:colorEditor},{name: 'strokeColor', editor:colorEditor},{name:'animate', editor:BoolEditor},{name:'progress', editor:BoolEditor},{name:'isProcessing', editor:BoolEditor}]),
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
