import React from 'react';
import _ from 'lodash';

const TooltipStyle = {
	position: 'absolute',
	padding: '0 5px'
};
const TooltipInnerStyle = {
	padding: '3px 8px',
	color: '#fff',
	textAlign: 'center',
	borderRadius: 3,
	backgroundColor: '#000',
	opacity: .75
};
const TooltipArrowStyle = {
	position: 'absolute',
	width: 0, height: 0,
	borderRightColor: 'transparent',
	borderLeftColor: 'transparent',
	borderTopColor: 'transparent',
	borderBottomColor: 'transparent',
	borderStyle: 'solid',
	opacity: .75
};
const PlacementStyles = {
	left: {
		tooltip: {marginLeft: -3, padding: '0 5px'},
		arrow: {
			right: 0, marginTop: -5, borderWidth: '5px 0 5px 5px', borderLeftColor: '#000'
		}
	},
	right: {
		tooltip: {marginRight: 3, padding: '0 5px'},
		arrow: {left: 0, marginTop: -5, borderWidth: '5px 5px 5px 0', borderRightColor: '#000'}
	},
	top: {
		tooltip: {marginTop: -3, padding: '5px 0'},
		arrow: {bottom: 0, marginLeft: -5, borderWidth: '5px 5px 0', borderTopColor: '#000'}
	},
	bottom: {
		tooltip: {marginBottom: 3, padding: '5px 0'},
		arrow: {top: 0, marginLeft: -5, borderWidth: '0 5px 5px', borderBottomColor: '#000'}
	}
};

export default class ToolTip extends React.Component {
	render() {
		let placementStyle = PlacementStyles[this.props.placement];

		let {
			style,
			arrowOffsetLeft: left = placementStyle.arrow.left,
			arrowOffsetTop: top = placementStyle.arrow.top} = this.props;

    let tooltipStyle = _.extend({},TooltipStyle,placementStyle.tooltip,style);
    let tooltipArrowStyle = _.extend({},TooltipArrowStyle,placementStyle.arrow,{left:left,top:top});

		return (
			<div style={tooltipStyle}>
				<div style={tooltipArrowStyle}/>
				<div style={TooltipInnerStyle}>
					{ this.props.children }
				</div>
			</div>
		);
	}
}
