import React from 'react';
import _ from 'lodash';

export default class Toolbar extends React.Component {
  up() {
    var items = this.props.current.parentNode.containers;
    var itemIndex = items.indexOf(this.props.current.node);
    if (itemIndex === 0) return;

    var element = items[itemIndex];
    var toIndex = _.max([0, itemIndex - 1]);

    var updated = items.splice(itemIndex, 1).splice(toIndex, 0, element);
    this.props.currentChanged(updated[toIndex]);
  }

  down() {
    var items = this.props.current.parentNode.containers;
    var itemIndex = items.indexOf(this.props.current.node);
    if (itemIndex === items.length - 1) return;

    var element = items[itemIndex];
    var toIndex = _.min([items.length, itemIndex + 1]);

    var updated = items.splice(itemIndex, 1).splice(toIndex, 0, element);
    this.props.currentChanged(updated[toIndex]);
  }

  removeCtrl() {
    var current = this.props.current.node;
    if (current === undefined) return;
    var parent = this.props.current.parentNode;
    if (parent === undefined) return;

    var items = this.isContainer() ? parent.containers : parent.boxes;

    //remove selected item
    var index = items.indexOf(current);
    var updated = items.splice(index, 1);

    //set current
    if (index < items.length) {
      this.props.currentChanged(updated[index]);
    }
  }

  copy() {
    var current = this.props.current.node;
    if (current === undefined) return;
    var parent = this.props.current.parentNode;
    if (parent === undefined) return;

    //clone
    var clone = _.cloneDeep(current);
    clone.name = 'Copy ' + clone.name;

    var isContainer = this.isContainer();

    //move down by item height
    if (!isContainer) clone.style.top = (current.style.top || 0) + (current.style.height || 0);

    var items = isContainer ? parent.containers : parent.boxes;

    //add new cloned of selected item
    var updated = items.push(clone);

    //set current
    var index = items.indexOf(current);
    this.props.currentChanged(updated[index]);
  }
  isContainer(){
    var current = this.props.current && this.props.current.node;
    return current !== undefined && current.boxes !== undefined;
  }


  render() {
    let {current} = this.props;

    var disabledCurrent = current.node === undefined || current.parentNode === undefined;
    var items = current.parentNode !== undefined ? current.parentNode.containers : [];
    var disabledMove = disabledCurrent || !this.isContainer() || items.lenght <= 1;

    //if first item - > disable
    var disabledUp = disabledMove || items.indexOf(this.props.current.node) === 0;
    //if last item -> disable
    var disabledDown = disabledMove || items.indexOf(this.props.current.node) === items.length - 1;

    return (
      <span>
				&nbsp;&nbsp;
				<button disabled={ disabledUp } type="button" className="btn btn-primary navbar-btn"
                onClick={this.up.bind(this)}>
					<span className="glyphicon glyphicon-open-file" title="move up"></span>
				</button>
				<button disabled={ disabledDown } type="button" className="btn btn-primary navbar-btn"
                onClick={this.down.bind(this)}>
					<span className="glyphicon glyphicon-save-file" title="move down"></span>
				</button>
        &nbsp;&nbsp;
				<button disabled={ disabledCurrent } type="button" className="btn btn-primary navbar-btn"
                onClick={this.copy.bind(this)}>
					<span className="glyphicon glyphicon-copy" title="copy element"></span>
				</button>
				<button disabled={ disabledCurrent } type="button" className="btn btn-primary navbar-btn"
                onClick={this.removeCtrl.bind(this)}>
					<span className="glyphicon glyphicon-trash" title="delete element"></span>
				</button>
			</span>
    );
  }
}
