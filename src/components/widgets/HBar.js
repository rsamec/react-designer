import React from 'react';

import _ from 'lodash';
import * as md from 'react-icons/lib/md';

var styleSvg  = function(style,fill) {

	style = _.clone(style) || {};
	if (fill === undefined) return style;


	style.fill = fill.color;
	style.fillOpacity = !!fill.alpha ? fill.alpha / 100 : 1;

	return style;
}

let HBar = (props) => {

  //var style = props.style || {};

  var iconStyle = {};
  //size
  if (props.item && props.item.height) iconStyle.height = props.item.height;
  if (props.item && props.item.width) iconStyle.width = props.item.width;

  var containerStyle = {display: 'flex', flexWrap: 'wrap'};
  if (props.width) containerStyle.width = props.width;
  if (props.height) containerStyle.height = props.height;

  var items = _.range(0, props.item && props.item.count || 20);

  var index = items.length * (props.value / 100);

  var icon = md[props.icon];


  var iconProps = styleSvg(iconStyle, props.color);
  var selectIconProps = styleSvg(iconStyle, props.selectColor);

  return (
    <div style={containerStyle}>
      {items.map(function (item, i) {
        return React.createElement(icon, _.extend(index > i ? selectIconProps : iconProps, {key: i}), null)
      })}
    </div>
  );
}

HBar.defaultProps = {
  icon: 'MdAccessibility',
  value: 50,
  item: {count: 20, height: 50, width: 50},
  color: {color: 'black'},
  selectColor: {color: 'red'}
}
export default HBar



