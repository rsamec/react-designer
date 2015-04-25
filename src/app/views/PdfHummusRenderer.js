var React = require('react');
var traverse = require('traverse');
var transformToPages = require('../utilities/transformToPages');

var PdfHummusRenderer = {
    transformToPdf:function(schema,data){

        var pages = transformToPages(schema,data);

        var pdf = {
            pages:[]
        };

        // add new page
        var defaultFontOptions ={
            "fontPath":"./resources/fonts/arial.ttf",
            "size":10,
            "color":"black"
        }
        var rectOptions ={
            "type":"stroke",
            "color":"gray"
        }


        var mapFontName = function(font){
            if (font === undefined) return "arial";
            if (font.bold && font.italic) return "arialbi";
            if (font.bold) return "arial";
            if (font.italic) return "ariali";
            return "arial"
        }
        var mapFontOptions = function(font){

            if (font === undefined) return defaultFontOptions;

            var color = defaultFontOptions.color;
            if (!!font.color){
                color =font.color[0]!="#"?font.color:parseInt(font.color.replace("#",""), 16);
            }
            return {
                "fontPath": !!font? "./resources/fonts/" + mapFontName(font) + ".ttf":defaultFontOptions.fontPath,
                "size":!!font.size?parseInt(font.size,10):defaultFontOptions.size,
                "color":color
            }
        }

        var mapTextBox = function(el, size){
           return {
                top: size.top,
                left: size.left,
                width: size.width,
                height: size.height,
                stream: {
                    items: [
                        {
                            type: "text",
                            text: [el.content],
                            options: mapFontOptions(el.font)
                        }
                    ]
                }
            }
        }
        var mapValueBox = function(el, size){
           return  {
                top: size.top,
                left: size.left,
                text: {
                    text: el.content,
                    options: mapFontOptions(el.font)
                }
            }
        }
        var externals = {};

        var mapImageBox = function(el, size){
            externals[el.name] = el.url;
            return  {
                top: size.top,
                left: size.left,
                image: {
                    external: el.name,
                    transformation:{
                        width: el.width * pixelPerPoint,
                        height:el.height * pixelPerPoint
                    }
                }
            }
        }
        var pixelPerPoint = 0.75;
        var marginPoints =  21.6; //7,62 mm
        var mapBox = function(node){
            var sizes = {
                top:842 - ((node.style.top * pixelPerPoint) +  marginPoints),
                left:node.style.left * pixelPerPoint + marginPoints,
                height:node.style.height * pixelPerPoint,
                width:node.style.width * pixelPerPoint
            };
            var el = node.element;
            if (el.elementName === "TextBox" && el.content !== undefined) return mapTextBox(el, sizes);
            if (el.elementName === "ValueBox" && !!el.Binding) return mapValueBox(el,sizes);
            if (el.elementName === "ImageBox" && el.url !== undefined) return mapImageBox(el,sizes);

            return;
        }

        //extract
        var pdf = {
            externals:externals,
            pages: pages.map(function (page) {
                return {
                    width: 595,
                    height: 842,
                    boxes: _.filter(page.boxes.map(function (box) {
                        return mapBox(box)
                    }),function(item){return item !== undefined})
                };
            })
        };

        return pdf;
    }
};

module.exports = PdfHummusRenderer;
