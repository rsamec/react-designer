'use strict';

var React = require('react/addons');
var ModalView = require('./ModalView');
var createChainedFunction = require('../utilities/createChainedFunction');

var ReactLayeredComponentMixin = {
    componentWillUnmount: function() {
        this._unrenderLayer();
        document.body.removeChild(this._target);
    },
    componentDidUpdate: function() {
        this._renderLayer();
    },
    componentDidMount: function() {
        // Appending to the body is easier than managing the z-index of everything on the page.
        // It's also better for accessibility and makes stacking a snap (since components will stack
        // in mount order).
        this._target = document.createElement('div');
        document.body.appendChild(this._target);
        this._renderLayer();
    },
    _renderLayer: function() {
        // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
        // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
        // entirely different part of the page.
        React.renderComponent(this.renderLayer(), this._target);
    },
    _unrenderLayer: function() {
        React.unmountComponentAtNode(this._target);
    }
};

var ModalViewTrigger = React.createClass({
    mixins: [ReactLayeredComponentMixin],
    toggle: function() {
        this.setState({shown: !this.state.shown});
    },
    getInitialState: function() {
        return {shown: false, modalShown: false};
    },
    renderLayer: function() {
        if (!this.state.shown) {
            return <span />;
        }
        return (
            <ModalView onRequestClose={this.toggle}>
                {this.props.modal}
            </ModalView>
        );
    },
    render: function() {
        var child = React.Children.only(this.props.children);
        return React.addons.cloneWithProps(child,{onClick: createChainedFunction(child.props.onClick, this.toggle)});
    }
});

module.exports = ModalViewTrigger;
