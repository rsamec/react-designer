import _ from 'lodash';

export default function styleFont(style, fontProps) {
	
	if (style === undefined) style = {};
	if (fontProps === undefined) return style;
	
	style = _.extend(style,fontProps) || {};
	if (fontProps.color) style['color'] = fontProps.color.color;
	if (fontProps.bold) style['fontWeight'] = 'bold';
	if (fontProps.italic) style['fontStyle'] = 'italic';
	if (fontProps.underline) style['borderBottom'] = '1px dashed #999';
	return style;
}

