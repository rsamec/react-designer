'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _VendorPrefix = require('react-vendor-prefix');

var _VendorPrefix2 = _interopRequireWildcard(_VendorPrefix);

var Pane = _React2['default'].createClass({
    displayName: 'Pane',

    getInitialState: function getInitialState() {
        return {};
    },

    render: function render() {
        var orientation = this.props.orientation;
        var classes = ['Pane', orientation];

        var style = {
            flex: 1,
            outline: 'none',
            overflow: 'auto'
        };
        if (this.state.size) {
            if (orientation === 'vertical') {
                style.height = this.state.size;
                style.display = 'flex';
            } else {
                style.width = this.state.size;
            }
            style.flex = 'none';
        }
        var prefixed = _VendorPrefix2['default'].prefix({ styles: style });
        return _React2['default'].createElement(
            'div',
            { className: classes.join(' '), style: prefixed.styles },
            this.props.children
        );
    }
});

exports['default'] = Pane;
module.exports = exports['default'];
