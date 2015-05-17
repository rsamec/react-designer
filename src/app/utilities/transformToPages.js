'use strict';

var React = require('react');
var traverse = require('traverse');
var deepClone = require('../utilities/deepClone');

//binding
var pathObjecBinder = require('./pathObjectBinder');

/**
 * This reduce containers objects (containers, repeaters) to boxes group by pages.
 * This reduce object schema tree to flat boxes group by pages.
 * The transformation has these steps
 * -    transform relative positions to absolute positions (top, left)
 * -    removes all content in hidden containers
 * -    expands repeatable container (using repeater binding)
 * -    group to pages
 * -    apply one-way data binding
 *
 * @param {object} schema - object schema tree
 * @param {object} data - data context used for data binding
 * @returns {object} schema to render -> pages with boxes with data-binded values
 */
function transformToPages(schema,data){

    const CONTAINER_NAME = "Container";
    const REPEATER_CONTAINER_NAME = "Repeater";
    const BOXES_COLLECTION_NAME = "boxes";


    //first clone schema
    var clonedSchema = deepClone(schema);

    //prepare helper object to grap data binded values -> create data binder
    var dataBinder = new pathObjecBinder(function(){return data});

    //TODO: each step means its own recursion - optimize by doing all steps using one recursion

    //step -> remove invisible sections (containers)
    traverse(clonedSchema).forEach(function (x) {
        if (!!x && x.elementName === CONTAINER_NAME && !!x.Visibility && !!x.Visibility.Path && !dataBinder.getValue(x.Visibility.Path)) {

            //get parent
            var parent = this.parent;
            if (parent !==undefined) parent = parent.parent;
            if (parent !==undefined) parent = parent.node;

            //decrese the height of the parent container
            if (parent !== undefined) {
                var parentHeight = parseInt(parent.style.height, 10);
                var nodeHeight = parseInt(x.style.height, 10);
                if (!isNaN(nodeHeight) && !isNaN(parentHeight)) parent.style.height = parentHeight - nodeHeight;
            }

            //invisible section -> delete
            this.delete();
        }
    });

    //step -> process repeatable sections (containers) - for each row - deep clone row template
    traverse(clonedSchema).forEach(function (x) {
        if (!!x && x.elementName === REPEATER_CONTAINER_NAME && !!x.Binding && !!x.Binding.Path) {
            var dataObj = dataBinder.getValue(x.Binding.Path);
            if (!!dataObj) {

                //for each row - deep clone row template
                var clonedRows = [];
                for (var i=0;i!= dataObj.length;i++){

                    var clonedRow = deepClone(x);

                    //apply binding using square brackets notation
                    traverse(clonedRow).forEach(function (y) {
                        //TODO: simple solution for demonstration purposes
                        if (this.key === "Path"){
                            var rowExpression = x.Binding.Path + "[" + i + "]." + y;
                            this.update(rowExpression);
                        }
                    });

                    clonedRows.push(clonedRow);
                }

                //assign all cloned rows to parent section
                x.containers = clonedRows;
                x.boxes = [];
            }
        }
    });

    //step -> transform relative positions to absolute positions, process repeatable sections (containers)
    var globalTop = 0;
    var trav = function(node){

        if (node === undefined) return 0;

        //grap height and top properties
        var nodeHeight = (node.style === undefined)?0:parseInt(node.style.height, 10);
        if (isNaN(nodeHeight)) nodeHeight = 0;
        var nodeTop = (node.style === undefined)?0:parseInt(node.style.top, 10);
        if (isNaN(nodeTop)) nodeTop = 0;


        var children = node.containers;
        var computedHeight = 0;
        if (children === undefined) return computedHeight;
        var childrenHeight = 0;

        //set absolute top property - use last global top + node top (container can have top != 0)
        if (node.style !== undefined) node.style.top = globalTop + nodeTop;

        //recurse by all its children containers
        for (var i in children)
        {
            childrenHeight += trav(children[i]);
        }

        //expand container height if childrenHeight is greater than node height - typically for repeated containers
        computedHeight = _.max([nodeHeight,childrenHeight]) +  nodeTop;
        //var tmp =  node.style!==undefined?node.style.top:'--';
        //console.log(node.name + ":" + height + "->" + top + ", " + tmp);

        //compute next top
        globalTop += (computedHeight-childrenHeight);
        //return computed height of container
        return computedHeight;
    };
    trav(clonedSchema);


    //step -> reduce to boxes - using containers absolute positions (top,height) and its dimensions (with, height)
    //step -> create pages and add boxes to them
    var pageHeight = 1065;
    var pages = [];
    var currentPage;
    traverse(clonedSchema).reduce(function (occ,x) {

        if (this.key === BOXES_COLLECTION_NAME){
            var parent = this.parent.node;
            for (var i in x){
                var el = x[i];

                //grep parent positions
                var top = parseInt(parent.style.top,10) + parseInt(el.style.top,10)
                var left = parseInt(parent.style.left,10) + parseInt(el.style.left,10);

                //grep parent dimensions
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

                // set another box
                currentPage.boxes.push({element:x[i],style:{'left':left,'top':top,'height': height,'width': width, 'position':'absolute'}});
            }
        }
        return occ;
    }, pages);


    //step -> apply one-way binding
    _.each(pages,function(page){
        _.each(page.boxes,function(node) {
            var box = node.element;
            for (var propName in box){
                var prop = box[propName];
                //TODO: better test - it is a binding object?
                if (_.isObject(prop) && !!prop.Path){
                    //one-way binding
                    box[propName] = dataBinder.getValue(prop.Path);
                }
            }
        })
    })

    return pages;
}

module.exports = transformToPages;
