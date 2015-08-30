import React from 'react';
import _ from 'lodash';
import ReactPivot from 'react-pivot';

export class PivotTable extends React.Component{
    render() {
        //prepare helper object to grap data binded values -> create data binder
        var dataBinder = this.props.dataBinder;


        var rows = dataBinder === undefined?this.props.rows:dataBinder.getValue(this.props.rows.Path);
        var dimensions = dataBinder === undefined?this.props.dimensions:dataBinder.getValue(this.props.dimensions.Path);

        if (rows === undefined) return <span>no data available</span>

        var reduce;
        if (this.props.reduce !== undefined) reduce = new Function(this.props.reduce.code)();
        var calculations;
        if (this.props.calculations !== undefined) calculations = new Function(this.props.calculations.code)();
        var rowsCount = (this.props.nPaginateRows !==undefined)?this.props.nPaginateRows:10;


        return (
            <ReactPivot rows={rows}
                        dimensions={dimensions}
                        reduce={reduce}
                        calculations={calculations}
                        nPaginateRows={rowsCount} />
        )
    }
}

export default {
    PivotTable:_.extend(PivotTable,{
        metaData: {
            props: {
                rows:{},
                dimensions:{},
                calculations:{
                    code:"return [{title: 'Count',	value: 'count',className: 'alignRight'}];"
                },
                reduce:{
                    code:"return function(row, memo) {memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row.transaction.amount); return memo;}"
                },
                nPaginateRows:10
            },
            settings: {
                fields: {
                    rows: {
                        type: 'bindingEditor'
                    },
                    dimensions: {
                        type: 'bindingEditor'
                    },
                    reduce: {
                        type: 'codeEditor'
                    },
                    calculations: {
                        type: 'codeEditor'
                    }
                }
            }
        }
    })
}
