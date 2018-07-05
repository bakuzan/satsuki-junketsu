import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';

import DnDType from 'constants/dnd-type';

function handleDrag(props) {
  if (props.onDrag) {
    props.onDrag(props);
  }

  return props;
}

const pieceSource = {
  beginDrag: handleDrag,
  endDrag: handleDrag
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

export default function withDragSource(WrappedComponent) {
  class Source extends React.Component {
    componentDidMount() {
      // TODO add a special preview
      // this.props.connectDragPreview();
    }
    render() {
      const { connectDragSource, connectDragPreview, ...props } = this.props;

      return (
        <WrappedComponent
          {...props}
          ref={instance => connectDragSource(findDOMNode(instance))}
        />
      );
    }
  }

  return DragSource(DnDType.piece, pieceSource, collectSource)(Source);
}