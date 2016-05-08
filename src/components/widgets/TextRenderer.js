import React from 'react';

import styleFont from './utils/font';

let TextRenderer = (props) => {

	var style = props.style || {};

	styleFont(style, props.font);

	//size
	if (props.height) style.height = props.height;
	if (props.width) style.width = props.width;


	return (
		<span style={style}>{props.content}</span>
	);
}

TextRenderer.defaultProps = {
  content:'type your content'
};
export default TextRenderer;



