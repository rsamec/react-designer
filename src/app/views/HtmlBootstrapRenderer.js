var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var traverse = require('traverse');

//binding
var BindToMixin = require('react-binding');
//business-rules-engine
var FormSchema = require("business-rules-engine/commonjs/FormSchema");
var Utils = require("business-rules-engine/commonjs/Utils");
var PathObjecBinder = require('../components/PathObjectBinder');

var widgets = {
    "TextBoxInput": require('../widgets/TextBoxInput'),
    "CheckBoxInput": require('../widgets/TextBoxInput'),
    "TextBox": require('../widgets/TextBox'),
    "ValueBox": require('../widgets/ValueBox'),
    "Html":require('../widgets/HtmlRenderer'),
    "TinyMceEditor":require('../widgets/HtmlRenderer'),
    "React.Griddle":require('griddle-react')
}

var bootstrapWidgets =["Input","Button", "Panel","Glyphicon","Tooltip"];
_.each(bootstrapWidgets,function(widgetName){
    var name = "ReactBootstrap." + widgetName;
    widgets[name] = ReactBootstrap[widgetName];
});

var businessRules = {
    "Employee": {
        "type": "object",
        "properties": {
            "FirstName": {
                "type": "string",
                "title": "First name",
                "required": "true",
                "maxLength": "15"
            },
            "LastName": {
                "type": "string",
                "title": "Last name",
                "required": "true",
                "maxLength": "15"
            },
            "Contact": {
                "type": "object",
                "properties": {
                    "Email": {
                        "type": "string",
                        "title": "Email",
                        "required": "true",
                        "maxLength": 100,
                        "email": "true"
                    }
                }
            }
        }
    }
}
var fakeData =  [
    {
        "id": 0,
        "name": "John Smith",
        "city": "Prague",
        "state": "Hawaii",
        "country": "Czech Repulic",
        "company": "Ovolo",
        "favoriteNumber": 7
    },
    {
        "id": 1,
        "name": "Karol Janme",
        "city": "Kapowsin",
        "state": "Hawaii",
        "country": "United Kingdom",
        "company": "Ovolo",
        "favoriteNumber": 7
    },
    {
        "id": 2,
        "name": "Mayer Leonard",
        "city": "Kapowsin",
        "state": "Hawaii",
        "country": "United Kingdom",
        "company": "Ovolo",
        "favoriteNumber": 7
    },
    {
        "id": 3,
        "name": "Aaaaa Bbbbbb",
        "city": "Kapowsin",
        "state": "Hawaii",
        "country": "United Kingdom",
        "company": "Ovolo",
        "favoriteNumber": 7
    },
    {
        "id": 4,
        "name": "Mayer Leonard",
        "city": "Kapowsin",
        "state": "Hawaii",
        "country": "United Kingdom",
        "company": "Ovolo",
        "favoriteNumber": 7
    }
];
var HtmlBootstrapRenderer = React.createClass({
    mixins:[BindToMixin],
    getInitialState: function() {
        return {
            data: {
                Hobbies:fakeData
            },
            rules:new FormSchema.JsonSchemaRuleFactory(businessRules).CreateRule("Main")
        };
    },
    _handleDialogOpen: function() {
        if (this.result().HasError){
            //TODO: show error dialog;
            //return;
        }
        //show data dialog
        this.refs.customDialog.show();
    },

    _handleDialogSubmit: function() {
        this.refs.customDialog.dismiss();
    },
    result:function(){
        if (this.state.rules === undefined) return {Errors:{}};
        return Utils.CompositeDotObject.Transform(this.state.rules.Validate(this.state.data)).Main;
    },
    transformToBoxes:function(){
        //visible
        var clone = traverse(this.props.data).map(function (x) {
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
        //reduce to boxes
        var boxes = [];
        var pages = traverse(containers).reduce(function (occ,x) {
            //if (this.key === "containers") return this.node.boxes;

            if (this.key === "boxes"){
                var parent = this.parent.node;
                //console.log("style:" + node.style.top + " " + node.style.height + " " + node.style.left + " " + node.style.width);

                for (var i in x){
                    var el = x[i];
                    var top = parseInt(parent.style.top,10) + parseInt(el.style.top,10);
                    var left = parseInt(parent.style.left,10) + parseInt(el.style.left,10);
                    var height = parseInt(el.style.height,10);
                    var width = parseInt(el.style.width,10);
                    if (isNaN(height)) height = 0;
                    if (isNaN(width)) width = 0;

                    // set another text box
                    boxes.push({element:x[i],style:{'left':left,'top':top, 'position':'absolute'}});
                }
            }
            return occ;
        }, boxes);
        return boxes;
    },
    createComponent: function (box) {
        var widget =widgets[box.elementName];
        if (!!box.Binding){
            if (box.elementName === "ReactBootstrap.Input") {
                box.valueLink = this.bindToState('data', box.Binding);
                var error = new PathObjecBinder(this.result).getValue(box.Binding);
                box.help = error.ErrorMessage;
                box.bsStyle = error.HasErrors ? 'error' : '';
            }
            else if (box.elementName === "ValueBox") {
                box.valueLink = this.bindToState('data', box.Binding);
                box.content = box.valueLink.value;
            }
            else if (box.elementName === "React.Griddle"){
                box.results = this.bindArrayToState('data', box.Binding).items.map(function(item){return item.value});
            }
            else{

            }
        }
        if (widget === undefined){
            return React.DOM.span(null,"Component '" + box.elementName + "' is not register among widgets.")
        }
        var props = _.omit(box,'style');
        return React.createElement(widget,props, box.content!== undefined?React.DOM.span(null, box.content):undefined);

    },
    render: function () {
        var standardActions = [
            { text: 'Cancel' },
            { text: 'Submit', onClick: this._onDialogSubmit }
        ];
        var boxes = this.transformToBoxes();
        return (
            <div>
                <div>
                {boxes.map(function (node, i) {
                    var element = node.element;
                    var style = node.style;
                    var component = this.createComponent(element);
                    return (
                        <div style={style}>
                            {component}
                        </div>
                    );
                }, this)}
                </div>
            </div>
        );
    }
});

module.exports = HtmlBootstrapRenderer;
