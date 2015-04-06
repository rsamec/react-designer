var React = require('react');
var traverse = require('traverse');
var PathObjecBinder = require('../components/PathObjectBinder');

var PDFRenderer = {
    transformToPdf:function(schema,data){
        var binder = new PathObjecBinder(function(){return data;});
        var clone = traverse(schema).map(function (x) {
            return x;
        });
        //transform from relative to absolute
        var containers = traverse(clone).map(function (x) {
            if (this.key === "containers"){
                var heigth =0;
                for (var i in x){
                    var container = x[i];
                    container.style.top = heigth;
                    var tempHeight =parseInt(container.style.height,10);
                    heigth +=  tempHeight!==undefined?tempHeight:0;
                }
            }
            return x;
        });

        var pdf = {
            pages:[]
        };
        // add new page
        var newPage = {
            width:595,
            height:842,
            boxes:[]
        };
        pdf.pages.push(newPage);

        var boxes = [];
        var rectOptions ={
            "type":"stroke",
            "color":"gray"
        }
        var textOptions = {
            "fontPath":"./resources/fonts/arial.ttf",
            "size":10,
            "color":"black"
        };

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
                            options: textOptions
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
                    text: binder.getValue(el.Binding),
                    options: textOptions
                }
            }
        }

        //extract
        var pages = traverse(containers).reduce(function (occ,x) {

            if (this.key === "boxes"){
                var parent = this.parent.node;
                //console.log("style:" + node.style.top + " " + node.style.height + " " + node.style.left + " " + node.style.width);

                for (var i in x) {
                    var el = x[i];
                    var top = parseInt(parent.style.top, 10) + parseInt(el.style.top, 10);
                    var left = parseInt(parent.style.left, 10) + parseInt(el.style.left, 10);
                    //TODO: !!!! temporarily - container width simulates boxes width
                    var height = parseInt(parent.style.height, 10);
                    var width = parseInt(parent.style.width, 10);

                    if (isNaN(height)) height = 0;
                    if (isNaN(width)) width = 0;

                    var sizes = {
                        top:842 - top,
                        left:left,
                        height:height,
                        width:width
                    }

                    var newBox = undefined;
                    if (el.elementName === "TextBox" && el.content !== undefined){
                        newBox = mapTextBox(el,sizes)
                    }
                    else if (el.elementName === "ValueBox" && !!el.Binding){
                        newBox = mapValueBox(el,sizes);
                    }

                    if (newBox !== undefined)  boxes.push(newBox);
                }
            }
            return occ;
        }, boxes);

        newPage.boxes = boxes;
        return pdf;
    }
};

module.exports = PDFRenderer;
