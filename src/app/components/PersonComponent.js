/**
 * Created by rsamec on 1.3.2015.
 */
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
