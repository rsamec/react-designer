module.exports = function(font) {

    var style = {};
    if (font === undefined) return style;

    if (font.size !== undefined) style['font-size'] = font.size;
    if (font.color !== undefined) style['color'] = font.color;
    if (font.bold) style['font-weight'] = 'bold';
    if (font.italic) style['font-style'] = 'italic';
    if (font.underline) style['border-bottom'] = '1px dashed #999';
    return style;
}

