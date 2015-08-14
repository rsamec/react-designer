import React from 'react';
import BindToMixin from 'react-binding';
import _ from 'lodash';

import {HtmlPagesRenderer,BootstrapPublisher} from 'react-page-renderer';

var Preview = React.createClass({
    mixins: [BindToMixin],
    getInitialState() {
        return {data: _.cloneDeep(this.props.schema.props.defaultData)}
    },
    render: function () {
        var schema = this.props.schema; //_.cloneDeep(this.props.schema);
        var dataContext = this.bindToState('data');

        if (schema.input) {
            var rules = schema.businessRules || {};
            var style = {height: '90vh', width: '90vw'};

            return (
                <div style={style}>
                    <BootstrapPublisher widgets={this.props.widgets} schema={schema} rules={rules}
                                        dataContext={dataContext}/>
                </div>
            )
        }
        else {
            return (
                <div>
                    <HtmlPagesRenderer widgets={this.props.widgets} schema={schema} data={this.state.data}
                                       intlData={schema.intlData} dataContext={dataContext}/>
                </div>
            );
        }
    }
});

module.exports = Preview;
