'use strict';
var React = require('react');

var JSXBox = React.createClass({

    render: function () {
        var div = React.createFactory('div');
        //empty content
        if (this.props.content === undefined) return div({},'type your code');

        try {
            var code = JSXTransformer.transform(
                '(function() {' +
                this.props.content +
                '\n})();',
                {harmony: true}
            ).code;

            //compiled content
            var props = this.props;
            return eval(code);
        }
        catch(err){
            //error content
            return div({}, err.message);
        }
    }
});
module.exports = JSXBox;
