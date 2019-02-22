import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

import _withDropTarget from './Target';
import _withDragSource from './Source';
import isTouchDevice from './supportsTouch';

const HTML5DND = DragDropContext(HTML5Backend);
const TouchDND = DragDropContext(TouchBackend);

export default function DnDBackend(WrappedComponent) {
  class HTML5DragDrop extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  if (isTouchDevice()) {
    return TouchDND(HTML5DragDrop);
  } else {
    return HTML5DND(HTML5DragDrop);
  }
}

export const withDropTarget = _withDropTarget;
export const withDragSource = _withDragSource;
