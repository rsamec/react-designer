import React from 'react';
import _ from 'lodash';
import {MdTextFields,MdTextFormat,MdChromeReaderMode,MdPolymer,MdFormatListBulleted,MdFormatShapes,MdCheckBoxOutlineBlank,MdCropOriginal,MdDeveloperMode,MdInsertChart,MdInsertPhoto,MdAddAPhoto,MdMap} from 'react-icons/lib/md';

var uiTiles = require('./templates/UITiles.json').containers;

const list = [
	{
		name: 'Core.TextContent',
		title:'Text',
		icon: MdTextFields,
		desc: 'Simple text without formating'
	},
	{
		name: 'Core.RichTextContent',
		title:'Rich text',
		icon: MdTextFormat,
		desc: 'Rich text with basic formatting - bold, italic, underline'
	},
	{
		name: 'Core.HtmlContent',
		title:'Html content',
		icon: MdPolymer,
		desc: 'Html markup'
	},
	{
		name: 'Core.JsxContent',
		title:'JSX content',
		icon: MdDeveloperMode,
		desc: 'React javascript + html markup'
	},
	{
		name: 'Core.BackgroundBox',
		title:'Box',
		icon: MdCheckBoxOutlineBlank,
		desc: 'ParagrphsSimple text without formating'
	},
	{
		name: 'Core.ImageBox',
		title:'Image box',
		icon: MdCropOriginal,
		desc: 'ParagrphsSimple text without formating'
	},
	{
		name: 'Core.HtmlBox',
		title:'Html box',
		icon: MdFormatShapes,
		desc: 'ParagrphsSimple text without formating'
	},
	{
		name: 'Core.ArticleContent',
		title:'Article content',
		icon: MdChromeReaderMode,
		desc: 'ParagrphsSimple text without formating'
	},
	{
		name: 'Core.ListItemContent',
		title:'List Item Content',
		icon: MdFormatListBulleted,
		desc: 'ParagrphsSimple text without formating'
	},
	{
		name: 'Core.SmartImageBox',
		title:'Smart Image Box',
		icon: MdInsertPhoto,
		desc: 'ParagrphsSimple text without formating'
	},
	{
		name: 'Core.ATvImageBox',
		title:'Apple TV Image',
		icon: MdAddAPhoto,
		desc: 'ParagrphsSimple text without formating'
	},
	{
		name: 'react-gmaps.Gmaps',
		title:'Google maps',
		icon: MdMap,
		desc: 'Googel maps'
	},
	{
		name: 'Chart.HBar',
		title:'Horizontal bars',
		icon: MdMap,
		desc: 'Horizontal bars'
	},
	{
		name: 'react-input-range.InputRange',
		title:'Input range slider',
		icon: MdMap,
		desc: 'Input range slider'
	}];
var containerList = [
	{
		name: 'Container',
		title:'Container',
		icon: MdMap,
		desc: 'Container'
	},
	{
		name: 'BackgroundContainer',
		title:'Background Container',
		icon: MdMap,
		desc: 'BackgroundContainer'
	},
	{
		name: 'Repeater',
		title:'Repeater',
		icon: MdMap,
		desc: 'Repeater'
	},
	{
		name: 'Grid',
		title:'Grid',
		icon: MdMap,
		desc: 'Grid'
	},
	{
		name: 'Cell',
		title:'Cell',
		icon: MdMap,
		desc: 'Cell'
	}
];

var layoutList = _.map(uiTiles,function(item){
	return	{
		container: item,
		name: 'Group',
		title: item.name,
		icon: MdMap,
		desc: item.name
	}});


let ToolBox = (props) => {
	return (
		<div>
      <h3>Containers</h3>
      <hr/>
      {containerList.map(function(item,i){
        var addFce = ()=> {

          var style = (item.name === 'Container' ||  item.name === 'BackgroundContainer') ? {height: 200, width: 740}:{};
          props.add({
            elementName: item.name,
            style:style,
            containers:[],
            boxes:[]
          })
        }
        return <div key={'l' + i}  onClick={addFce}>
          {React.createElement(item.icon,{width:60,height:60})}
          <span style={{fontSize:18}}>{item.title}</span>
        </div>
      })}
      <h3>Layouts</h3>
      <hr/>
      {layoutList.map(function(item,i){
        var addFce = ()=> {
          props.add({
            elementName: item.name,
            container:item.container
          })
        }
        return <div key={'l' + i}  onClick={addFce}>
          {React.createElement(item.icon,{width:60,height:60})}
          <span style={{fontSize:18}}>{item.title}</span>
        </div>
      })}
			<h3>Basic content</h3>
			<hr/>
			{list.map(function(item,i){
				var addFce = ()=> {
					props.add({
						elementName: item.name
					})
				}
				return <div key={'l' + i}  onClick={addFce}>
					{React.createElement(item.icon,{width:60,height:60})}
					<span style={{fontSize:18}}>{item.title}</span>
					</div>
			})}
			<h3>Charts</h3>
			<hr/>
			{props.dataSource.Charts.controls.map(function(item,i){
				var addFce = ()=> {
					props.add({
						elementName: item.name
					})
				}
				return <div key={'l' + i}  onClick={addFce}>
					{React.createElement(item.icon,{width:60,height:60})}
					<span style={{fontSize:18}}>{item.title}</span>
				</div>
			})}
		</div>
	)
}
ToolBox.defaultProps = {
	dataSource: {
		//{
		//	type: 'Text',
		//	collapsed: false,
		//	controls: [
		//		{name: 'Core.HtmlBox', title: 'HtmlEditor'},
		//		{name: 'Core.TextBox', title: 'TextBox'},
		//		{name: 'Core.JSXBox', title: 'JSXBox'},
		//		{name: 'Core.ValueBox', title: 'ValueBox'},
		//	]
		//},
		//{
		//	type: 'Images',
		//	collapsed: false,
		//	controls: [
		//
		//		{name: 'Core.ImageBox', title: 'ImageBox'},
		//		{name: 'Core.ImagePanel', title: 'ImagePanel'},
		//		{name: 'Core.ImageCarousel', title: 'ImageCarousel'}
		//	]
		//},
		//{
		//	type: 'Input',
		//	collapsed: false,
		//	controls: [
		//		{name: 'Core.TextBoxInput', title: 'TextBoxInput'},
		//		{name: 'Core.CheckBoxInput', title: 'CheckBoxInput'},
		//		{name: 'Core.SelectBoxInput', title: 'SelectBoxInput'},
		//		{name: 'Core.TangleNumberText', title: 'TangleNumberText'},
		//		{name: 'Core.TangleBoolText', title: 'TangleBoolText'}
		//	]
		//},
		Shapes: {
			type: 'Shapes',
			collapsed: true,
			controls: _.map(['Rectangle', 'Circle', 'Ellipse', 'Line', 'Triangle', 'Dimension'], function (x) {
				return {
					name: 'Shapes.' + x, title: x
				}
			})
		},
		Charts: {
			type: 'Charts',
			collapsed: true,
			controls: _.map(['Bar', 'Pie', 'Tree', 'SmoothLine', 'StockLine', 'Scatterplot', 'Radar'], function (x) {
				return {name: 'Chart.' + x, title: x, icon: MdInsertChart}
			})
		},
		Bootstrap: {
			type: 'Bootstrap',
			collapsed: true,
			controls: _.map(['Input', 'Button', 'Panel', 'Glyphicon', 'Tooltip', 'Alert', 'Label'], function (x) {
				return {
					name: 'react-bootstrap.' + x, title: x
				}
			})
		},
		Panels: {
			type: 'Panels',
			collapsed: false,
			controls: [
				{name: 'Container', title: 'Container'},
				{name: 'Repeater', title: 'Repeater'}
			]
		},
		Extra: {
			type: 'Extra',
			collapsed: true,
			controls: [
				{name: 'Core.PivotTable', title: 'Pivot table'},
				{name: 'Core.Flipper', title: 'Flipper'},
				{name: 'react-griddle', title: 'Griddle'},
				{name: 'react-inlinesvg', title: 'SvgBox'}
				//        {name: 'MovieSelect', title: 'Movie carousel select'}
				//        //{name: 'Reacticon', title: 'Reacticon'},
				//        //{name: 'SnapSvgBox', title: 'SnapSvgBox'},
			]
		}
	}
}
export default ToolBox;
