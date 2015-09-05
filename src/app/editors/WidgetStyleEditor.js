import React from 'react';
import _ from 'lodash'
import PropertyEditor from 'react-property-editor';
import Widgets from '../components/WidgetFactory.js';
import clearObject from '../utilities/clearObject.js';

var options = _.mapValues(Widgets,
    function(value,key,object){
        var widget =object[key];
        return {name:key,value:key}
    }
);
var settings = {form: false,
    fixedFields:false,
    adder:false,
    editing:true
};
export default class WidgetStyleEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKey:'Shapes.Rectangle'
        };
    }
    selectChange(e){
        this.setState({selectedKey:e.target.value});
    }
    exist(){
        var value = this.props.value || {};
        return value[ this.state.selectedKey] !== undefined;
    }
    add() {

        if (this.exist()) return;

        //update value
        var key = this.state.selectedKey;
        if (key === undefined) return;

        var newValue = _.cloneDeep(this.props.value) || {};
        newValue[key] = clearObject(Widgets[key].metaData.props);
        this.props.onUpdated(newValue);


    }
    render() {
        var select = <select value={this.state.selectedKey} onChange={this.selectChange.bind(this)}>
            {
                _.map(options,function (option, i) {
                    return (<option key={i} value={option.value}>{option.name}</option>)
                })
            };
        </select>

        var widgets = Widgets;
        var customFields= _.reduce(this.props.value,function(memo,value,key){
            memo[key] = {fields:widgets[key].metaData.settings && widgets[key].metaData.settings.fields};
            return memo;
            },{});
        settings.fields = customFields;

        var notExist = !this.exist();
        var value = _.reduce(this.props.value,function(memo,value,key){
            memo[key] = _.merge(clearObject(Widgets[key].metaData.props),value);
            return memo;
        },{});

        return (
            <div>

                <PropertyEditor value={value} onChange={this.props.onUpdated} settings={settings}></PropertyEditor>
                {select}
                {notExist?<a onClick={this.add.bind(this)}>add</a>:null}
            </div>
        );
    }
};

