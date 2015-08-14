'use strict';

import React from 'react';
import PropertyEditor from 'react-property-editor';

import Widgets from './WidgetFactory';
import ComponentMetaData from './ComponentMetaData.js';


var ObjectPropertyGrid = React.createClass({
    widgetPropsChanged: function (updatedValue) {
        var current = this.props.current.node;
        var updated = current.set("props", updatedValue);
        this.props.currentChanged(updated);
    },
    commonPropsChanged:function(updatedValue){
        var current = this.props.current.node;
        var updated = current.set("style", updatedValue.style);
        this.props.currentChanged(updated);
    },

    render: function () {
        var currentNode = this.props.current.node;
        var elementName = currentNode.elementName;

        var settings = (elementName === "Container" || elementName === "Repeater" || elementName === "ObjectSchema")? ComponentMetaData[elementName].metaData.settings:Widgets[elementName].metaData.settings;
        var props = currentNode.toJS().props;

        var commonProps = {
            name:currentNode.name,
            style:currentNode.style
        };

        return (
            <div>
                <PropertyEditor value={commonProps}
                                onChange={ this.commonPropsChanged }/>
                <PropertyEditor value={props} settings={settings}
                                onChange={ this.widgetPropsChanged }/>
            </div>
        );
    }
});

module.exports = ObjectPropertyGrid;
