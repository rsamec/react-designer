import React from 'react';
import Widgets from './WidgetFactory.js';

export default class WidgetIcon extends React.Component {
    handleClick(e) {
        this.props.onClick(this.props.eventKey);
    }
    render() {
        var noIcon = React.DOM.span(null, this.props.label);

        //if (this.props.name.indexOf('Shapes.') === -1) return noIcon;
        //
        //var  widget = Widgets[this.props.name];
        //if (widget!== undefined) return React.createElement(Widgets[this.props.name], {width:30,height:30}, null);

        return noIcon

    }
}
