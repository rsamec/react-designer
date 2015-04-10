var React = require('react');
var transformToPages = require('../utilities/transformToPages');

var WidgetFactory = require('../components/WidgetFactory');

//binding
var PathObjecBinder = require('../utilities/pathObjectBinder');

var widgets = WidgetFactory.getWidgets();

var HtmlPage = React.createClass({
    render: function () {
        return (
            <div className="cPageOuter">
                <div className="cPage">
                    {this.props.children}
                    <span>{this.props.pageNumber}</span>
                </div>
            </div>
        );
    }
});
var HtmlRenderer = React.createClass({

    createComponent: function (box) {
        var selfData = this.props.data;
        var binder = new PathObjecBinder(function(){return selfData;});

        var widget =widgets[box.elementName];
        if (widget === undefined){
            return React.DOM.span(null,"Component '" + box.elementName + "' is not register among widgets.")
        }
        //apply binding
        if (!!box.Binding){
           box.content = binder.getValue(box.Binding);
        }
        var props = _.omit(box,'style');
        return React.createElement(widget,props, box.content!== undefined?React.DOM.span(null, box.content):undefined);

    },
    render: function () {
        var pages = transformToPages(this.props.schema,this.props.data);
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
