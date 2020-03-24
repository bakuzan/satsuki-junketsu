import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

import _withDropTarget from './Target';
import _withDragSource from './Source';
import isTouchDevice from './supportsTouch';

function getBackend() {
  if (isTouchDevice()) {
    return TouchBackend;
  } else {
    return HTML5Backend;
  }
}

export default function DnDBackend(WrappedComponent) {
  const backend = getBackend();

  class HTML5DragDrop extends React.Component {
    render() {
      return (
        <DndProvider backend={backend} context={window}>
          <WrappedComponent {...this.props} />
        </DndProvider>
      );
    }
  }

  return HTML5DragDrop;
}

export const withDropTarget = _withDropTarget;
export const withDragSource = _withDragSource;
