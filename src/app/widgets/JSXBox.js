'use strict';
var React = require('react');
var BindToMixin = require('react-binding');

var TangleNumberText = require('./TangleNumberText');
var TangleBoolText = require('./TangleBoolText');

var ReactIntl = require('react-intl');
var IntlMixin = ReactIntl.IntlMixin;
var FormattedNumber = ReactIntl.FormattedNumber;
var FormattedDate = ReactIntl.FormattedDate;
var FormattedTime = ReactIntl.FormattedTime;
var FormattedRelative = ReactIntl.FormattedRelative;
var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedHTMLMessage = ReactIntl.FormattedHTMLMessage;
var chainedFunction = require('../utilities/createChainedFunction');

//shortcuts
var TangleText = TangleNumberText;
var BoolText = TangleBoolText;

var JSXBox = React.createClass({
    mixins:[IntlMixin],
    shouldComponentUpdate(){
        return true;
    },
    render: function () {
        var div = React.createFactory('div');
        //empty content
        if (this.props.content === undefined) return div({},'type your code');

        try {

            //var code = JSXTransformer.transform(
            //    '(function() {' +
            //    this.props.content +
            //    '\n})();',
            //    {harmony: true}
            //).code;

            //compiled content
            var props = this.props;
            var self = this;
            return div({},eval(this.props.code));
        }
        catch(err){
            //error content
            return div({}, err.message);
        }
    }
});
module.exports = JSXBox;
