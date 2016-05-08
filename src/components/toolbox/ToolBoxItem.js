import React from 'react';
import _ from 'lodash';
//import Radium from 'radium';

export default class ToolBoxItem extends React.Component {
  render() {
    const {imgUrl, addFce, container} =  this.props;

    var divStyle = {
      position: 'relative',
      backgroundImage: 'url(' + imgUrl + ')',
      backgroundRepeat: 'no-repeat',
      //backgroundSize:'contain',
      width: container.style.width,
      height: container.style.height
    };

    var containerWidth = container.style && container.style.width;
    //var containerHeight = container.style && container.style.height;
    return (
      <div style={divStyle}>
        {
          _.map(container.boxes, function (item, index) {

            var itemStyle = _.clone(item.style);
            itemStyle.borderWidth = 1;
            itemStyle.minWidth = 20;
            itemStyle.minHeight = 40;
            itemStyle.width = item.style.width || containerWidth;
            itemStyle.height = item.style.height;
            itemStyle.position = 'absolute';
            itemStyle[':hover'] = {
              backgroundColor: 'lightblue',
              opacity: 0.5
            };
            //itemStyle['width'] = item.props.width;
            //itemStyle['height'] = item.props.height;
            return (<div key={'tool' + index} style={itemStyle} onClick={()=>{addFce(item)}}></div>)
          }, this)}
      </div>

    )
  }
}
//export default Radium(ToolBoxItem);
