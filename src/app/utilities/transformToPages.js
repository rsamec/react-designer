'use strict';

var traverse = require('traverse');
var deepClone = require('../utilities/deepClone');

//binding
var PathObjecBinder = require('./pathObjectBinder');

/**
 * This reduce containers objects (containers, repeaters) to boxes group by pages.
 * This reduce object schema tree to flat boxes group by pages.
 * The transformation has these steps
 * -    transform relative positions to absolute positions (top, left)
 * -    removes all content in hidden containers
 * -    expands repeatable container (using repeater binding)
 * -    group to pages
 * -    apply data binding
 *
 * @param {object} schema - object schema tree
 * @param {object} data - data context used for data binding
 * @returns {object} schema to render -> pages with boxes with data-binded values
 */
function transformToPages(schema,data){

    var binder = new PathObjecBinder(function(){return data});

    //visible
    var clone = traverse(schema).map(function (x) {
        return x;
    });

    var top = 0;
    var trav = function(node,parent){

        if (node === undefined) return 0;
        //var nodeHeight = getHeight(node);
        var nodeHeight = (node.style === undefined)?0:parseInt(node.style.height, 10);
        if (node.elementName === "Repeater" && !!node.Binding){
            var dataObj = binder.getValue(node.Binding);
            if (!!dataObj) {
                var nodeIndex = parent.containers.indexOf(node);
                //if (nodeIndex !== -1) parent.containers.splice(nodeIndex,1);
                var clonedNodes = [];
                for (var i=0;i!= dataObj.length;i++){
                    var clonedNode = deepClone(node);
                    traverse(clonedNode).forEach(function (x) {
                        if (this.key === "Binding"){
                            this.update(node.Binding + "[" + i + "]." + x);
                        }
                    });
                    clonedNodes.push(clonedNode);
                }

                //apply
                node.containers = clonedNodes;
                node.boxes = [];
            }
        }

        var containers = node.containers;
        var height = 0;
        if (containers === undefined) return height;
        var childrenHeight = 0;
        for (var i in containers)
        {
            childrenHeight += trav(containers[i],node);
        }

        if (node.style !== undefined) node.style.top = top;
        height = _.max([0,nodeHeight - childrenHeight]);
        top += height;
        //console.log(node.name + ":" + height + "->" + top);
        return height;
    }

    //transform from relative to absolute
    trav(clone);

    //reduce to boxes
    var pageHeight = 1065;
    var pages = [];
    var currentPage;
    traverse(clone).reduce(function (occ,x) {
        //if (this.key === "containers") return this.node.boxes;

        if (this.key === "boxes"){
            var parent = this.parent.node;
            //console.log("style:" + node.style.top + " " + node.style.height + " " + node.style.left + " " + node.style.width);

            for (var i in x){
                var el = x[i];
                var top = (parseInt(parent.style.top,10) + parseInt(el.style.top,10))
                var left = parseInt(parent.style.left,10) + parseInt(el.style.left,10);
                //TODO: !!!! temporarily - container width simulates boxes width
                var height = parseInt(parent.style.height, 10);
                var width = parseInt(parent.style.width, 10);
                //var height = parseInt(el.style.height,10);
                //var width = parseInt(el.style.width,10);
                if (isNaN(height)) height = 0;
                if (isNaN(width)) width = 0;


                //create newPage
                if (currentPage === undefined || (top + height) > pageHeight * pages.length){
                    var newPage ={pageNumber:pages.length + 1,boxes:[]}
                    pages.push(newPage);
                    currentPage = newPage;
                }
                //decrease top according the pages
                if (pages.length > 1){ top -= (pages.length -1) * pageHeight };
                // set another text box
                currentPage.boxes.push({element:x[i],style:{'left':left,'top':top,'height': height,'width': width, 'position':'absolute'}});
            }
        }
        return occ;
    }, pages);


    //apply binding
    _.each(pages,function(page){
        _.each(page.boxes,function(node) {
            var box = node.element;
            if (!!box.Binding){
                box.content = binder.getValue(box.Binding);
            }
        })
    })

    return pages;
}

module.exports = transformToPages;
