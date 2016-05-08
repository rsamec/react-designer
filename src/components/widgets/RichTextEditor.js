import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
  KeyBindingUtil
} from 'draft-js';
import {Overlay} from 'react-overlays';
import Toolbox from './RichTextEditorToolbox';
import RichTextRenderer from './RichTextRenderer';

const {hasCommandModifier} = KeyBindingUtil;

const styleFont = function (style, fontProps) {

  if (style === undefined) style = {};
  if (fontProps === undefined) return style;

  style = _.extend(style, fontProps) || {};
  if (fontProps.color) style['color'] = fontProps.color.color;
  if (fontProps.bold) style['fontWeight'] = 'bold';
  if (fontProps.italic) style['fontStyle'] = 'italic';
  if (fontProps.underline) style['borderBottom'] = '1px dashed #999';
  return style;
}

var myKeyBindingFn = function (e) {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}
class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      showBlockStyleControls: false,
      showInlineStyleControls: false,
      show: false
    };

    this.focus = () => this.refs.editor.focus();
    this.saveChanges = _.debounce(this.saveChanges, 500);
    this.onChange = (editorState) => {
      this.setState({editorState});
      this.saveChanges();
    };


    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  componentWillMount() {
    var content = this.props.node && this.props.node.props && this.props.node.props.content;
    this.setState({editorState: content !== undefined ? EditorState.createWithContent(ContentState.createFromBlockArray(convertFromRaw(content))) : EditorState.createWithContent(ContentState.createFromText('Type your content'))});
  }

  toolboxToggle() {
    let show = this.state.show;
    //let placements = ['left', 'top', 'right', 'bottom'];
    let placement = this.state.placement;

    placement = 'top';//placements[placements.indexOf(placement)];

    if (!show) {
      show = true;
      placement = 'top';//placements[0];
    }
    else if (!placement) {
      show = false;
    }

    return this.setState({show, placement});
  }

  saveChanges() {
    const {editorState} = this.state;
    var current = this.props.current;
    var updated = current.set('props',
      _.extend({
        content: convertToRaw(editorState.getCurrentContent())
      }, _.omit(current.props, 'content')));

    this.props.currentChanged(updated)
  }


  //componentWillUnmount(){
  //	var content =this.state.editorState.getCurrentContent();
  //	var raw = convertToRaw(content);
  //	var updated = this.props.current.set({"props": {"content":raw}});
  //	this.props.currentChanged(updated);
  //}
  _handleKeyCommand(command) {
    const {editorState} = this.state;

    if (command === 'myeditor-save') {
      var current = this.props.current;
      var updated = current.set('props',
        _.extend({
          content: convertToRaw(editorState.getCurrentContent())
        }, _.omit(current.props, 'content')));

      this.props.currentChanged(updated);
      return true;
    }
    else {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return true;
      }
    }
    return false;
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.state;
    const {node} = this.props;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    var style = this.props.style || {};

    styleFont(style, node.props && node.props.font);

    return (
      <div>
        <div className="RichEditor-root">
          <div style={style} className={className} onClick={this.focus} onMouseEnter={this.toolboxToggle.bind(this)}
               onMouseLeave={this.toolboxToggle.bind(this)}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand.bind(this)}
              keyBindingFn={myKeyBindingFn}
              onChange={this.onChange}
              placeholder="Tell a story..."
              ref="editor"
              spellCheck={true}
            />
          </div>
        </div>
        <Overlay
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          placement={this.state.placement}
          container={this}
          target={ () => ReactDOM.findDOMNode(this.refs.editor)}
        >
          <Toolbox>
            {/*<BlockStyleControls
             editorState={editorState}
             onToggle={this.toggleBlockType}
             />
             */}
            <InlineStyleControls
              editorState={editorState}
              onToggle={this.toggleInlineStyle}
            />

          </Toolbox>
        </Overlay>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
    );
  }
}

// const BLOCK_TYPES = [
//   {label: 'H1', style: 'header-one'},
//   {label: 'H2', style: 'header-two'},
//   {label: 'Blockquote', style: 'blockquote'},
//   {label: 'UL', style: 'unordered-list-item'},
//   {label: 'OL', style: 'ordered-list-item'},
//   {label: 'Code Block', style: 'code-block'}
// ];

// const BlockStyleControls = (props) => {
//   const {editorState} = props;
//   const selection = editorState.getSelection();
//   const blockType = editorState
//     .getCurrentContent()
//     .getBlockForKey(selection.getStartKey())
//     .getType();
//
//   return (
//     <div className="RichEditor-controls">
//       {BLOCK_TYPES.map((type) =>
//         <StyleButton
//           key={type.label}
//           active={type.style === blockType}
//           label={type.label}
//           onToggle={props.onToggle}
//           style={type.style}
//         />
//       )}
//     </div>
//   );
// };

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'}
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};


let RichText = (props) => {
  var box = props.designer ? <RichEditor {...props}/> : <RichTextRenderer {...props}/>;
  return box;
}

//RichEditorRenderer.defaultProps = {content:'type your content'};
export default RichText;
