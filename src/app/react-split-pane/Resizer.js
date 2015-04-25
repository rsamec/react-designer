'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var Resizer = _React2['default'].createClass({
    displayName: 'Resizer',

    handleDown: function handleDown() {
        this.props.down();
    },

    render: function render() {
        var orientation = this.props.orientation;
        var classes = ['Resizer', orientation];
        return _React2['default'].createElement('span', { className: classes.join(' '), onMouseDown: this.handleDown });
    }
});

exports['default'] = Resizer;
module.exports = exports['default'];