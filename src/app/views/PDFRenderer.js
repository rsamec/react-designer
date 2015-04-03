var React = require('react');
var traverse = require('traverse');

var PDFRenderer = React.createClass({
    //transformToPdf:function(){
    //
    //    var top = 0;
    //
    //    //visible
    //    var clone = traverse(this.props.store).map(function (x) {
    //        return x;
    //    });
    //    //transform from relative to absolute
    //    var containers = traverse(clone).map(function (x) {
    //        if (this.key === "containers"){
    //            var heigth =0;
    //            for (var i in x){
    //                var container = x[i];
    //                container.style.top = heigth;
    //                heigth += container.style.height;
    //            }
    //        }
    //        return x;
    //    });
    //
    //    var mapTextNode = function(top, left,x){
    //        return {
    //            top:top,
    //            left:left,
    //            text:{
    //                text:x.innerText
    //            }
    //        }
    //    };
    //    var pdf = new BytescoutPDF();
    //    // set document properties: Title, subject, keywords, author name and creator name
    //    pdf.propertiesSet("Sample document title", "Sample subject", "keyword1, keyword 2, keyword3", "Document Author Name", "Document Creator Name");
    //
    //    // add new page
    //    pdf.pageAdd();
    //
    //    //extract
    //    var pages = traverse(containers).reduce(function (occ,x) {
    //        //if (this.key === "containers") return this.node.boxes;
    //
    //        if (this.key === "boxes"){
    //            var parent = this.parent.node;
    //            //console.log("style:" + node.style.top + " " + node.style.height + " " + node.style.left + " " + node.style.width);
    //
    //            for (var i in x){
    //                var el = x[i];
    //                var top = parseInt(parent.style.top,10) + parseInt(el.style.top,10);
    //                var left = parseInt(parent.style.left,10) + parseInt(el.style.left,10);
    //                var height = parseInt(el.style.height,10);
    //                var width = parseInt(el.style.width,10);
    //                if (isNaN(height)) height = 0;
    //                if (isNaN(width)) width = 0;
    //
    //                // set another text box
    //                pdf.textSetBox(left,top, width,height);
    //                pdf.graphicsDrawRectangle(left,top, width,height);
    //
    //                occ.textAddToBox(x[i].text.replace("<p>","").replace("</p>",""),true);
    //            }
    //        }
    //        return occ;
    //    }, pdf);
    //
    //    var pdfLink = "data:application/pdf;base64," + pdf.getBase64Text();
    //    this.setState({pdf:pdfLink});
    //    //    {
    //    //        "width": 595,
    //    //        "height": 842,
    //    //        "boxes": [
    //    //            {
    //    //                "bottom": 500,
    //    //                "left": 10,
    //    //                "text": {
    //    //                    "text": "hello world",
    //    //                    "options": {
    //    //                        "fontPath": "./resources/fonts/arial.ttf",
    //    //                        "size": 40,
    //    //                        "color": "pink"
    //    //                    }
    //    //                }
    //    //            }
    //    //        ]
    //    //    }
    //    //]
    //
    //},
    render: function () {
        return (
            <div>
            </div>
        );
    }
});

module.exports = PDFRenderer;
