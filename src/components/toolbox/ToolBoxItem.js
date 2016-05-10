import React from 'react';
import _ from 'lodash';
//import Radium from 'radium';

export default class ToolBoxItem extends React.Component {
  add(item){
    var style = item.style || {};
    style.top = undefined;
    style.left = undefined;
    this.props.addFce(item);
  }
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
            return (<div key={'tool' + index} style={itemStyle} onClick={()=>{this.add(item)}}
                         onMouseOver={(e)=> {
                          var item = e.target;
                          item.style['background-color'] = 'lightblue';
                          item.style['opacity'] = 0.5;
                         }}
                         onMouseOut={(e)=> {
                          var item = e.target;
                          item.style['background-color'] = 'transparent';
                          item.style['opacity'] = 1;
                         }}></div>)
          }, this)}
      </div>

    )
  }
}
//export default Radium(ToolBoxItem);
