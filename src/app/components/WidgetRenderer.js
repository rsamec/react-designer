import React from 'react';
import _ from 'lodash';
import BindToMixin from 'react-binding';

var WidgetRenderer = React.createClass({
    mixins:[BindToMixin],
    applyBinding(widget,box,dataBinder){
        //go through all properties
        for (var propName in box) {
            var prop = box[propName];


            //TODO: find better way how to detect binding
            var field = widget.metaData && widget.metaData.settings && widget.metaData.settings.fields[propName];
            var isBinding = field !== undefined && field.type === 'bindingEditor';

            //if binding -> replace binding props
            if (isBinding) {

                //bind to const value
                //if (prop.value !== undefined) {
                //    box[propName] = prop.value;
                //    continue;
                //}


                var bindingProps = prop; //field.type === 'bindingEditor'?prop:prop.binding;
                if (_.isObject(bindingProps) && !!bindingProps.path) {
                    //apply binding
                    var converter;
                    if (!!prop.Converter && !!bindingProps.converter.compiled) {
                        converter = eval(bindingProps.converter.compiled);
                    }
                    var binding = this.bindTo(dataBinder, bindingProps.path, converter);

                    if (prop.Mode === 'TwoWay') {
                        //two-way binding
                        //box.valueLink = this.bindTo(dataBinder, bindingProps.path, converter);
                        box[propName] = undefined;
                    }
                    else {
                        //one-way binding
                        //box[propName] = dataBinder.value[prop.Path];
                        box[propName] = binding.value;
                    }
                }
                else {
                    //binding is not correctly set - do not apply binding
                    box[propName] = undefined;
                }
            }
        }
    },
    render(){
        var box = this.props.node;
        var widget  = this.props.widget;
        if (widget === undefined) {
            return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');
        }

        var customStyle= this.props.customStyle;
        console.log("CustomStyle:" + customStyle);
        console.log("IntlData:" + this.props.intlData);
        //apply property resolution strategy -> default style -> custom style -> local style
        var widgetStyle = _.cloneDeep(widget.metaData.props);
        if (customStyle !== undefined) widgetStyle = _.merge(widgetStyle,customStyle);
        var props = _.merge(widgetStyle,box.props);
        if (this.props.dataBinder !== undefined)  this.applyBinding(widget,props,this.props.dataBinder);

        return  React.createElement(widget,props,props.content !== undefined ? React.DOM.div({ dangerouslySetInnerHTML: {__html: props.content } }) : null);
    }
});
export default  WidgetRenderer;
//WidgetRenderer.propTypes = { widget:  React.PropTypes.node, value:React.PropTypes.object,dataBinder:React.PropTypes.object };
