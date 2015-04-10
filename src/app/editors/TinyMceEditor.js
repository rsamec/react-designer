var React = require("react");
var tinymce = require('tinymce');

var genUnique = (function () {
    var count = 0;
    return function () {
        return 'id' + count++;
    }
})();

var TinyMceEditor = React.createClass({
    getDefaultProps: function () {
        return {
            id: genUnique()
        }
    },
    getInitialState:function() {
        return {init:false};
    },
    tinyMceInstance:function(){
        var model = this.model;
        tinymce.baseURL = "./bower_components/tinymce/";
        tinymce.init({
            selector: "#"+ this.props.id,
            menubar: false,
            plugins: ["link","code"],
            target_list: [],
            resize: false,
            height: 300,
            toolbar: "undo redo | bold italic underline | link | cut copy paste | code",
            setup: function(editor) {
                editor.on('change', function(e) {
                    model.contentSetter(editor.getContent({format : 'raw'}));
                });
                editor.on('loadContent', function(e) {
                    editor.setContent(model.content,{format : 'raw'});
                });
            }
        });
    },
    componentDidMount: function () {
        tinymce.execCommand('mceRemoveEditor',true, this.props.id);
        this.tinyMceInstance();
    },
    render: function () {
        this.model = this.props;
        return (
            <textarea id={this.props.id} ref="text" />
        );
    }
});
module.exports = TinyMceEditor;
