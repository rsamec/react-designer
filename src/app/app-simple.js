/** @jsx React.DOM */

'use strict';

var React = require('react');
var mui = require('material-ui');
var BindToMixin = require('react-binding');


var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Checkbox = mui.Checkbox;
var RadioButtonGroup = mui.RadioButtonGroup;
var RadioButton = mui.RadioButton;
var Dialog = mui.Dialog;


var Hobby = React.createClass({
    mixins: [BindToMixin],
    handleClick: function (e) {
        e.preventDefault();
        return this.props.onDelete(this.props.model.value);
    },
    handleChange: function (e) {
        //e.preventDefault();
        this.frequency().value = e.target.value;
    },
    frequency: function () {
        return this.bindTo(this.props.model, "Frequency");
    },
    frequencyName: function () {
        return "frequency" + this.props.index;
    },
    hobbyName: function () {
        return (this.props.index + 1) + ". hobby name";
    },
    render: function () {
        return (
            <li>
                <TextField hintText="type your hobby" floatingLabelText={this.hobbyName()} valueLink={this.bindTo(this.props.model, "HobbyName")} />

                <RaisedButton label="Delete" secondary={true} onClick={this.handleClick} />
                <div>
                    <strong>Frequency:</strong>
                </div>
                <RadioButtonGroup
                    name={this.frequencyName()}
                    defaultSelected={this.frequency().value}
                    onChange={this.handleChange}>
                    <RadioButton
                        value="Daily"
                        label="Daily" />
                    <RadioButton
                        value="Weekly"
                        label="Weekly" />
                    <RadioButton
                        value="Monthly"
                        label="Monthly" />
                </RadioButtonGroup>

                <CheckBoxInput label="Is this a paid hobby?" model={this.bindTo(this.props.model, "Paid")} />
                <CheckBoxInput label="Would you recommend this hobby to a friend?" model={this.bindTo(this.props.model, "Recommendation")} />

            </li>
        );
    }
});

var HobbyForm = React.createClass({
    mixins: [BindToMixin],
    getInitialState: function () {
        return {data: {}};
    },
    addHobby: function (e) {
        if (this.state.data.Hobbies === undefined)
            this.state.data.Hobbies = []
        this.state.data.Hobbies.push({});
        this.setState({data: this.state.data})
    },
    _handleDialogOpen: function() {
        this.refs.customDialog.show();
    },

    _handleDialogSubmit: function() {
        this.refs.customDialog.dismiss();
    },
    render: function () {
        var standardActions = [
            { text: 'Cancel' },
            { text: 'Submit', onClick: this._onDialogSubmit }
        ];
        return (
            <div className="mainForm">
                <div>
                    <PersonComponent personModel={this.bindToState("data", "Person")}  />
                    <RaisedButton label="Add hobby" secondary={true} onClick={this.addHobby} />
                    <HobbyList  model={this.bindArrayToState("data", "Hobbies")} />
                </div>
                <br/>
                <RaisedButton label="Save" secondary={true} onClick={this._handleDialogOpen} />
                <Dialog ref="customDialog" title="Data send to server" actions={standardActions}>
                    <PrettyJson json={this.state.data} />
                </Dialog>


            </div>
        );
    }
});

var HobbyList = React.createClass({
    handleDelete: function (hobby) {
        return this.props.model.remove(hobby);
    },
    render: function () {
        if (this.props.model.items === undefined) return <span>There are no hobbies.</span>;

        var hobbyNodes = this.props.model.items.map(function (hobby, index) {
            return (
                <Hobby model={hobby} key={index} index={index} onDelete={this.handleDelete} />
            );
        }, this);
        return (
            <ul className="hobbyList">
                {hobbyNodes}
            </ul>
        );
    }
});

var PersonComponent = React.createClass({
    mixins: [BindToMixin],
    render: function () {
        return (
            <div>
                <TextField hintText="type your first name" floatingLabelText="First Name" valueLink={this.bindTo(this.props.personModel, "FirstName")} />
                <TextField hintText="type your last name" floatingLabelText="Last Name" valueLink={this.bindTo(this.props.personModel, "LastName")} />
                <br/>
                <TextField hintText="type your email" floatingLabelText="Email" valueLink={this.bindTo(this.props.personModel, "Contact.Email")} />
            </div>
        );
    }
});

var TextBoxInput = React.createClass({
    render: function () {
        var valueModel = this.props.model;
        var handleChange = function (e) {
            valueModel.value = e.target.value;
        }
        return (
            <input type='text' onChange={handleChange} value={valueModel.value} />
        )
    }
});

var CheckBoxInput = React.createClass({
    render: function () {
        var valueModel = this.props.model;
        var handleChange = function (e) {
            valueModel.value = e.target.checked;
        }

        return (
            <Checkbox label={this.props.label}  onCheck={handleChange} value={valueModel.value} />
        )
    }
});


var PrettyJson = React.createClass({
    replacer: function (match, pIndent, pKey, pVal, pEnd) {
        var key = '<span class=json-key>';
        var val = '<span class=json-value>';
        var str = '<span class=json-string>';
        var r = pIndent || '';
        if (pKey)
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        if (pVal)
            r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
        return r + (pEnd || '');
    },

    prettyPrint: function (obj) {
        var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
        return JSON.stringify(obj, null, 3)
            .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(jsonLine, this.replacer);

    },
    render: function () {
        return (<pre dangerouslySetInnerHTML={{__html: this.prettyPrint(this.props.json)}}></pre>);
    }
})
React.render(
    <HobbyForm />,
    document.getElementById('app')
);
