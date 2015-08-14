import _ from 'lodash';

import Core from 'react-designer-widgets';
import Shapes from 'react-shapes';
import Chart from 'react-pathjs-chart';

//external widgets with more controls
import ReactBootstrap from 'react-bootstrap';
//var Griddle = require('griddle-react');
//var ChartistGraph = require('react-chartist');
import ReactIntl from 'react-intl';

var Widgets = {

    'Core.TextBoxInput': Core.TextBoxInput,
    'Core.CheckBoxInput': Core.CheckBoxInput,
    'Core.SelectBoxInput': Core.SelectBoxInput,
    'Core.JSXBox': Core.JSXBox,
    'Core.TextBox': Core.TextBox,
    'Core.ValueBox': Core.ValueBox,
    'Core.HtmlBox': Core.HtmlBox,
    'Core.ImageBox': Core.ImageBox,
    'Core.ImagePanel': Core.ImagePanel,
    'Core.Flipper': Core.Flipper,
    'Core.TangleNumberText': Core.TangleNumberText,
    'Core.TangleBoolText': Core.TangleBoolText,
    'Core.PivotTable': Core.PivotTable,

    'Shapes.Rectangle': Shapes.Rectangle,
    'Shapes.Ellipse': Shapes.Ellipse,
    'Shapes.Circle': Shapes.Circle,
    'Shapes.Line': Shapes.Line,
    'Shapes.Polyline': Shapes.Polyline,
    'Shapes.CornerBox': Shapes.CornerBox,

    'Chart.Pie': Chart.Pie,
    'Chart.Bar': Chart.Bar,
    'Chart.SmoothLine': Chart.SmoothLine,
    'Chart.StockLine': Chart.StockLine,
    'Chart.Scatterplot': Chart.Scatterplot,
    'Chart.Radar': Chart.Radar,
    'Chart.Tree': Chart.Tree


    //'ChartistGraph':require('../widgets/ChartistGraph'),
    //
    //'React.Griddle':Griddle,
    //'react-inlinesvg':require('react-inlinesvg'),
    //'react-3d-carousel':require('react-3d-carousel'),
    //'MovieSelect': require('react-movie-select')


    //'SnapSvgBox':require('../widgets/SnapSvgBox')
    //'Reacticon':require('../../../node_modules/reacticons/src/scripts/components/reacticon')
}

_.each(['FormattedDate', 'FormattedTime', 'FormattedRelative', 'FormattedNumber', 'FormattedMessage', 'FormattedHTMLMessage'], function (name) {
    Widgets['react-intl.' + name] = ReactIntl[name];
});

var bootstrapWidgets = ['Input', 'Button', 'Panel', 'Glyphicon', 'Tooltip', 'Alert', 'Label'];
_.each(bootstrapWidgets, function (widgetName) {
    var name = 'react-bootstrap.' + widgetName;
    Widgets[name] = ReactBootstrap[widgetName];
});

var bootstrapSettings = {
    fields:{
        //content:{type:'string'},
        bsSize:{type:'select',settings: {
            options: _.map(['large','medium','small','xsmall'], function (key, value) {
                return {value: key, label: key};
            })
        }},
        bsStyle:{type:'select',settings: {
            options: _.map(['default','primary','success','info','warning','danger','link'], function (key, value) {
                return {value: key, label: key};
            })
        }}
    }
};

_.extend(Widgets['react-bootstrap.Button'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});
_.extend(Widgets['react-bootstrap.Label'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Panel'], {
    metaData: {
        props: {
            header:"Header",bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Glyphicon'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', glyph: 'star'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Alert'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Well'], {
    metaData: {
        props: {
            bsSize: 'medium', bsStyle: 'default', content: 'Type content'
        },
        settings:bootstrapSettings
    }
});

_.extend(Widgets['react-bootstrap.Input'], {
    metaData: {
        props: {
            type: 'text',placeholder:'type your text', label:'label', help:'',value:''
        },
        settings:bootstrapSettings
    }
});


//return {
//    'ObjectSchema':[{name:'name'},{name:'data',editor:JsonEditor},{name:'businessRules',editor:JsonEditor},{name:'title'},{name:'input',editor:BoolEditor }, {name:'intlData', editor:JsonEditor}],
//    'Container':commonPropsSizes.concat([bindEditorFce('Visibility'), {name: 'startOnNewPage', editor:BoolEditor},{name: 'unbreakable', editor:BoolEditor}]),
//    'Repeater':commonPropsSizes.concat([bindEditorFce('Binding')], {name: 'startOnNewPage', editor:BoolEditor},{name: 'unbreakable', editor:BoolEditor}),
//    'react-pivot':commonProps.concat([bindEditorFce('rows'),bindEditorFce('dimensions'),{name:'reduce',editor: codeMirrorEditor},{name:'calculations',editor: codeMirrorEditor},{name:'nPaginateRows',editor: numEditor,args:{defaultValue:10}}]),
//    'MovieSelect':commonProps.concat([{name:'apiKey'},{name:'searchText'},numEditorFce('maxCount',10),bindEditorFce('selectedItems',true)]),
//    'ReactIntl.FormattedNumber':formattedProps,
//    'ReactIntl.FormattedDate':formattedProps,
//    'ReactIntl.FormattedTime':formattedProps,
//    'ReactIntl.FormattedRelative':formattedProps,
//    'ReactIntl.FormattedMessage':commonProps.concat([bindEditorFce('message')]),
//    'ReactIntl.FormattedHTMLMessage':commonProps.concat([bindEditorFce('message')]),
//}
//


module.exports = Widgets;
