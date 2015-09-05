'use strict';

import React from 'react';
import _ from 'lodash';
import PropertyEditor from 'react-property-editor';

import Widgets from './WidgetFactory';
import ComponentMetaData from './ComponentMetaData.js';
import clearObject from "../utilities/clearObject.js";
import WidgetStyleEditor  from '../editors/WidgetStyleEditor';

PropertyEditor.registerType('widgetStyleEditor',WidgetStyleEditor);


var ObjectPropertyGrid = React.createClass({
    widgetPropsChanged: function (updatedValue) {
        var current = this.props.current.node;
        var updated = current.set("props", updatedValue);
        this.props.currentChanged(updated);
    },
    commonPropsChanged:function(updatedValue){
        var current = this.props.current.node;
        var updated;
        if (current.name !== updatedValue.name){
            updated = current.set("name", updatedValue.name);
        }
        else{
            updated = current.set("style", updatedValue.style);
        }
        this.props.currentChanged(updated);
    },

    render: function () {
        var currentNode = this.props.current.node;
        var elementName = currentNode.elementName;


        var metaData = (elementName === "Container" || elementName === "Repeater" || elementName === "ObjectSchema")? ComponentMetaData[elementName].metaData:Widgets[elementName].metaData;

        //props
        var props = _.merge(clearObject(metaData.props),currentNode.toJS().props);
        var settings = metaData && metaData.settings || {};


        var commonProps = { name:currentNode.name}
        if (elementName !== "ObjectSchema") commonProps["style"] = currentNode.style;

        return (
            <div>
                <PropertyEditor value={commonProps} onChange={ this.commonPropsChanged }/>
                <PropertyEditor value={props} settings={settings}
                                onChange={ this.widgetPropsChanged }/>
            </div>
        );
    }
});

module.exports = ObjectPropertyGrid;
