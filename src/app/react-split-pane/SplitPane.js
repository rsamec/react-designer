'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _Pane = require('./Pane');

var _Pane2 = _interopRequireWildcard(_Pane);

var _Resizer = require('./Resizer');

var _Resizer2 = _interopRequireWildcard(_Resizer);

var _VendorPrefix = require('react-vendor-prefix');

var _VendorPrefix2 = _interopRequireWildcard(_VendorPrefix);

'use strict';

var SplitPane = _React2['default'].createClass({
    displayName: 'SplitPane',

    propTypes: {
        minSize: _React2['default'].PropTypes.number,
        orientation: _React2['default'].PropTypes.string
    },

    getInitialState: function getInitialState() {
        return {
            active: false
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            minSize: 0
        };
    },

    componentDidMount: function componentDidMount() {
        document.addEventListener('mouseup', this.up);
        document.addEventListener('mousemove', this.move);
    },

    componentWillUnmount: function componentWillUnmount() {
        document.removeEventListener('mouseup', this.up);
        document.removeEventListener('mousemove', this.move);
    },

    down: function down() {
        var position = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
        this.setState({
            active: true,
            position: position
        });
    },

    move: function move() {
        if (this.state.active) {
            var _ref = this.refs.pane1;
            if (_ref) {
                var node = _ref.getDOMNode();
                if (window.getComputedStyle) {
                    var styles = window.getComputedStyle(node);
                    var width = styles.width.replace('px', '');
                    var height = styles.height.replace('px', '');
                    var current = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
                    var size = this.props.orientation === 'horizontal' ? width : height;
                    var position = this.state.position;
                    var newSize = size - (position - current);
                    this.setState({
                        position: current
                    });
                    if (newSize >= this.props.minSize) {
                        _ref.setState({
                            size: newSize
                        });
                    }
                }
            }
        }
    },

    up: function up() {
        this.setState({
            active: false
        });
    },

    merge: function merge(into, obj) {
        for (var attr in obj) {
            into[attr] = obj[attr];
        }
    },

    render: function render() {
        var orientation = this.props.orientation;

        var style = {
            display: 'flex',
            flex: 1,
            position: 'relative',
            outline: 'none',
            overflow: 'hidden',
            userSelect: 'none'
        };

        if (orientation === 'vertical') {
            this.merge(style, {
                flexDirection: 'column',
                height: '100%',
                minHeight: '100%',
                //position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%'
            });
        } else {
            this.merge(style, {
                flexDirection: 'row',
                height: '100%',
                position: 'absolute',
                left: 0,
                right: 0
            });
        }

        var elements = [];
        var children = this.props.children;
        var child0 = children[0];
        var child1 = children[1];
        elements.push(_React2['default'].createElement(
            _Pane2['default'],
            { ref: 'pane1', key: 'pane1', orientation: orientation },
            child0
        ));
        elements.push(_React2['default'].createElement(_Resizer2['default'], { ref: 'resizer', key: 'resizer', down: this.down, orientation: orientation }));
        elements.push(_React2['default'].createElement(
            _Pane2['default'],
            { ref: 'pane2', key: 'pane2', orientation: orientation },
            child1
        ));

        var classes = ['SplitPane', orientation];

        var prefixed = _VendorPrefix2['default'].prefix({ styles: style });

        return _React2['default'].createElement(
            'div',
            { className: classes.join(' '), style: prefixed.styles, ref: 'splitPane' },
            elements
        );
    }
});

exports['default'] = SplitPane;
module.exports = exports['default'];
