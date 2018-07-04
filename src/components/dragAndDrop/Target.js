import React from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';

import DnDType from 'constants/dnd-type';

const squareTarget = {
  canDrop(props, monitor) {
    console.log('can drop', props);
    return props.dropActions.canDrop(monitor.getItem());
  },
  drop(props, monitor) {
    console.log('drop', props);
    return props.dropActions.onDrop(monitor.getItem());
  }
};

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

export default function withDropTarget(WrappedComponent) {
  class Target extends React.Component {
    render() {
      const { connectDropTarget, ...props } = this.props;

      return (
        <WrappedComponent
          {...props}
          ref={instance => connectDropTarget(findDOMNode(instance))}
        />
      );
    }
  }

  return DropTarget(DnDType.square, squareTarget, collectTarget)(Target);
}