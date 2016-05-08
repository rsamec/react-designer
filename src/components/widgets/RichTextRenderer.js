import React from 'react';
import backdraft from 'backdraft-js';

import styleFont from './utils/font';

const markup = {
	'BOLD': ['<strong>', '</strong>'],
	'ITALIC': ['<em>', '</em>']
};

let RichTextRenderer = (props) => {

	var style = props.style || {};

	styleFont(style, props.font);

	//size
	if (props.height) style.height = props.height;
	if (props.width) style.width = props.width;

	var htmlContentArray = props.content!==undefined?backdraft(props.content,markup):['type your content'];

	return (
		<div style={style}>
			{htmlContentArray.map(function(htmlContent,i){
				if (htmlContent === '') htmlContent+='<BR />';
			return <div key={'h' + i} dangerouslySetInnerHTML={{__html: htmlContent}}/>
			})}
		</div>
	);
}

//RichEditorRenderer.defaultProps = {content:'type your content'};
export default RichTextRenderer;



