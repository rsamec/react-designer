import React from 'react';
//import backdraft from 'backdraft-js';
import {convertToRaw,convertFromRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import styleFont from './utils/font';

// const markup = {
// 	'BOLD': ['<strong>', '</strong>'],
// 	'ITALIC': ['<em>', '</em>'],
// 	'UNDERLINE': ['<span style="text-decoration: underline">', '</span>'],
// 	'CODE': ['<span style="font-family:monospace;font-size:16px;padding:2px;background-color: rgba(0, 0, 0, 0.05)">', '</span>']
// }

let RichTextRenderer = (props) => {

	var style = props.style || {};

	styleFont(style, props.font);

	//size
	if (props.height) style.height = props.height;
	if (props.width) style.width = props.width;

	var htmlContent = props.content !== undefined ? stateToHTML(convertFromRaw(props.content)) : ['type your content'];

	return (
		<div style={style} dangerouslySetInnerHTML={{__html: htmlContent}}>
			
		</div>
	);
}
//RichEditorRenderer.defaultProps = {content:'type your content'};
export default RichTextRenderer;



