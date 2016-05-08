import React from 'react';
import _ from 'lodash';
import { Cell } from 'react-flexr';

import backgroundStyle from './utils/backgroundStyle';
import styleBorder from'./utils/border'

let CellWrapper = (props) => {

  var styles = {};

  //apply parent props
  var parentProps = props.parentProps || {};

  if (parentProps.border !== undefined) styleBorder(styles, parentProps.border);

  //padding
  if (parentProps.padding !== undefined) {
    var size = parentProps.padding || {};
    styles.paddingTop = size.top;
    styles.paddingRight = size.right;
    styles.paddingBottom = size.bottom;
    styles.paddingLeft = size.left;
  }

  var selfProps = props;

  //styles.width = "100%";

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


  return <Cell {...props}>
    <div style={styles}>{props.children}</div>
  </Cell>
}

export default CellWrapper;



