var React = require('react');
var _ = require('lodash');

import styleFont from './utils/font';

let Renderer = (props) => {

  //empty content
  if (props.content === undefined || props.content.compiled === undefined) return React.createElement('span',{}, 'empty code');

  try {
    var _lodash = _;
    var self = this;
    var data = props.data;
    return React.createElement('div',{style:styleFont(props.font)}, eval(props.content.compiled));
  }
  catch (err) {
    //error content
    return React.createElement('span',{}, err.message);
  }

}

//Renderer.defaultProps = {content:'type your content'};
export default Renderer; 

