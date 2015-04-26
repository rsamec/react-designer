'use strict';

module.exports = function(font) {

    var style = {};
    if (font === undefined) return style;

    if (font.size !== undefined) style['fontSize'] = font.size;
    if (font.color !== undefined) style['color'] = font.color;
    if (font.bold) style['fontWeight'] = 'bold';
    if (font.italic) style['fontStyle'] = 'italic';
    if (font.underline) style['borderBottom'] = '1px dashed #999';
    return style;
}

