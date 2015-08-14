import React from 'react';
import _ from 'lodash';

export default class WidgetRenderer
{
    applyBinding(widget,box,dataBinder){
        //go through all properties
        for (var propName in box){
            var prop = box[propName];


            //TODO: find better way how to detect binding
            var field = widget.metaData && widget.metaData.settings && widget.metaData.settings.fields[propName];
            var isBinding = field!== undefined && field.type === 'bindingEditor';

            //if binding -> replace binding props
            if (isBinding && _.isObject(prop) && prop.Mode !== 'TwoWay'){
                //one-way binding
                box[propName] = !!prop.Path?dataBinder.value[prop.Path]:undefined;
            }
        }
    }
    render(){
        var box = this.props.node;
        var widget  = this.props.widget;
        if (widget === undefined) {
            return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');
        }
        var props = _.cloneDeep(box.props);
        if (this.props.dataBinder !== undefined)  this.applyBinding(widget,props,this.props.dataBinder);

        return  React.createElement(widget,props,props.content !== undefined ? React.DOM.div({ dangerouslySetInnerHTML: {__html: props.content } }) : null);
    }
}
WidgetRenderer.propTypes = { widget:  React.PropTypes.node, value:React.PropTypes.object,dataBinder:React.PropTypes.object };
