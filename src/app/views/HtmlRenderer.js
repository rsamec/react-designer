var React = require('react');
var transformToPages = require('../utilities/transformToPages');
var deepClone = require('../utilities/deepClone');

var WidgetFactory = require('../components/WidgetFactory');
var widgets = WidgetFactory.getWidgets();
var BindToMixin = require('react-binding');

var HtmlPage = React.createClass({
    render: function () {
        return (
            <div className="cPageOuter">
                <div className="cPage">
                    {this.props.children}
                </div>
            </div>
        );
    }
});
var HtmlRenderer = React.createClass({
    mixins:[BindToMixin],
    getInitialState:function(){
        return {tempData:this.props.data!==undefined?deepClone(this.props.data):{}}
    },
    createComponent: function (box) {
        var widget =widgets[box.elementName];
        if (widget === undefined) return React.DOM.span(null,'Component ' + box.elementName + ' is not register among widgets.');

        var props =  box; //_.omit(box,'style');
        return React.createElement(widget,props, box.content!== undefined?React.DOM.span(null, box.content):undefined);
    },
    render: function () {
        var pages = transformToPages(this.props.schema,this.state.tempData);

        var data = this.bindToState('tempData');

        //apply two-way binding
        _.each(pages,function(page){
            _.each(page.boxes,function(node) {
                var box = node.element;
                if (!!box.Binding){
                    if (box.elementName === "ReactBootstrap.Input" || box.elementName === "TextBoxInput" || box.elementName === "CheckBoxInput") {
                        box.valueLink = this.bindTo(data, box.Binding);
                    }
                }
            },this)

        },this)
        return (
            <div>
                 {pages.map(function(page,i){
                    return (<HtmlPage pageNumber={page.pageNumber}>
                        {page.boxes.map(function (node, i) {
                            var element = node.element;
                            var style = node.style;
                            var component = this.createComponent(element);
                            return (
                                <div style={style}>
                                    {component}
                                </div>
                            );
                        }, this)}
                    </HtmlPage>)
                 }, this)}

            </div>
        );
    }
});

module.exports = HtmlRenderer;
