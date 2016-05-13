import React from 'react';
import _ from 'lodash';
import { Grid } from 'react-flexr';

import backgroundStyle from './utils/backgroundStyle';
import styleBorder from'./utils/border'


let GridWrapper = (props) => {

  var styles = {};
  //styles.width = "100%";

  var selfProps = props;

  //apply custom background
  if (selfProps.background !== undefined) {
    styles = _.extend(styles, backgroundStyle(selfProps.background, {
      width: props.width,
      height: props.height
    }))
  }

  //border
  if (selfProps.border !== undefined) styleBorder(styles, selfProps.border);

  //padding
  if (selfProps.padding !== undefined) {
    var size = selfProps.padding || {};
    styles.paddingTop = size.top;
    styles.paddingRight = size.right;
    styles.paddingBottom = size.bottom;
    styles.paddingLeft = size.left;
  }

  //selfProps = _.omit(props,['width','height']);

  const childrenWithProps = React.Children.map(props.children,
    (child) => React.cloneElement(child, {width: '100%'}));
  return <Grid style={styles} {...props}>{childrenWithProps}</Grid>
}

export default GridWrapper;



