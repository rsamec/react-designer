import React from 'react';
import InputRange from 'react-input-range';
import styleFont from './utils/font';

let Renderer = (props) => {

  var style = props.style || {};

  styleFont(style, props.font);

  var valueLink = props.valueLink || {
      value: props.value, requestChange: ()=> {
      }
    };
  var handleChange = function (comp, values) {
    valueLink.requestChange(values);
  };
  return (
    <div style={style}>
      <InputRange {...props} value={valueLink.value} onChange={handleChange}/>
    </div>
  );
}

Renderer.defaultProps = {value:50,minValue:0,maxValue:100};
export default Renderer;



