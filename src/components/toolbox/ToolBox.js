import React from 'react';
import ToolBoxItem from './ToolBoxItem.js';
import ToolBoxCore from './ToolBoxCore.js';
import ToolBoxIcons from './ToolBoxIcons.js';



var textParagraph = require('./templates/TextParagraph.json').containers[0];
var textTitles = require('./templates/TextTitles.json').containers[0];
var textLists = require('./templates/TextLists.json').containers[0];
var textColumns = require('./templates/TextColumns.json').containers[0];
var shapeBasic = require('./templates/ShapeBasic.json').containers[0];
// var uiTiles = require('../toolbox/UITiles.json').containers;
//
// let Layouts = (props) =>{
// 	return (<div>
// 		<h3>Titles</h3>
// 		<hr/>
// 		{uiTiles.map(function(item,index){
// 			return <div key={'i' + index}><span style={{fontSize:18}}>{item.name}</span></div>
// 		})}
// 	</div>)
// }
const TOOLBOX_TEMPLATES_PATH =  './templates/';


let ToolBoxTexts = (props) => {
	return (<div>
			<h3>Titles</h3>
			<hr/>
			<ToolBoxItem imgUrl={require(TOOLBOX_TEMPLATES_PATH + 'TextTitles.jpg')} container={textTitles} addFce={props.add}/>
			<h3>Paragraphs</h3>
			<hr/>
			<ToolBoxItem  imgUrl={require(TOOLBOX_TEMPLATES_PATH + 'TextParagraph.png')} container={textParagraph} addFce={props.add}/>
			<h3>Lists</h3>
			<hr/>
			<ToolBoxItem imgUrl={require(TOOLBOX_TEMPLATES_PATH + 'TextLists.png')} container={textLists} addFce={props.add}/>
			<h3>Multiple columns paragraphs</h3>
			<hr/>
			<ToolBoxItem imgUrl={require(TOOLBOX_TEMPLATES_PATH + 'TextColumns.png')} container={textColumns} addFce={props.add}/>
		</div>
	)
}



let ToolBoxShapes = (props) => {
	return (
		<div>
			<h3>Basic shapes</h3>
			<hr/>
			<ToolBoxItem imgUrl={require(TOOLBOX_TEMPLATES_PATH + 'ShapeBasic.png')} container={shapeBasic} addFce={props.add}/>
		</div>
	)
}

var bootstrapCon = require('./templates/Bootstrap.json').containers[0];
let ToolBoxBootstrap = (props) => {
	return (
		<div>
			<h3>Image boxes</h3>
			<hr/>
			<ToolBoxItem imgUrl={require(TOOLBOX_TEMPLATES_PATH + 'Bootstrap.png')} container={bootstrapCon} addFce={props.add}/>
		</div>
	)
}

var imagesCon = require('./templates/Images.json').containers[0];
let ToolBoxImages = (props) => {
	return (
		<div>
			<h3>Image boxes</h3>
			<hr/>
			<ToolBoxItem imgUrl={require(TOOLBOX_TEMPLATES_PATH + 'Images.jpg')} container={imagesCon} addFce={props.add}/>
		</div>
	)
}
var chartCon = require('./templates/Chart.json').containers[0];
let ToolBoxCharts = (props) => {
	return (
		<div>
			<h3>Charts</h3>
			<hr/>
			<ToolBoxItem imgUrl={require(TOOLBOX_TEMPLATES_PATH + 'Chart.jpg')} container={chartCon} addFce={props.add}/>
		</div>
	)
}
const tabs = ['Core','Texts', 'Bootstrap', 'Images', 'Shapes', 'Chart','Icons'];
const tabContents = [ToolBoxCore,ToolBoxTexts, ToolBoxBootstrap, ToolBoxImages, ToolBoxShapes, ToolBoxCharts,ToolBoxIcons];

export default class ToolBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {selectedIndex: 0}
	}

	handleClick(ctrl) {
		this.props.addCtrl(ctrl.name);
	}

	add(item) {
		this.props.addCtrl(item.elementName, item);
	}

	render() {

		var currentTab = React.createElement(tabContents[this.state.selectedIndex], {add: this.add.bind(this)});

		return (
			<div>
				<ul className="nav nav-pills nav-stacked toolBox leftNav">
					{tabs.map(function (tabName, i) {
						var active = this.state.selectedIndex === i ? 'active' : null;
						return <li key={'titem' + i} className={active}><a
							onClick={()=>{this.setState({selectedIndex:i})}}>{tabName}</a></li>
					}, this)}
				</ul>
				<div>
					{currentTab}
				</div>
			</div>
		);
	}
}
