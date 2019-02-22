import React from 'react';
import classNames from 'classnames';

import { withDragSource } from 'components/dragAndDrop';
import SVGS from './pieceSvgs';
import Strings from 'constants/strings';
import { objectsAreEqual } from 'utils/common';

import './piece.scss';

class Piece extends React.Component {
  shouldComponentUpdate(nextProps) {
    const isDraggingChanged = nextProps.isDragging !== this.props.isDragging;
    const dataChanged = !objectsAreEqual(nextProps, this.props);

    return isDraggingChanged || dataChanged;
  }

  renderCoolChessPieceSvg(pieceName, pieceColour) {
    switch (pieceName) {
      case Strings.pieces.bishop:
        return <SVGS.Bishop colour={pieceColour} />;
      case Strings.pieces.king:
        return <SVGS.King colour={pieceColour} />;
      case Strings.pieces.knight:
        return <SVGS.Knight colour={pieceColour} />;
      case Strings.pieces.pawn:
        return <SVGS.Pawn colour={pieceColour} />;
      case Strings.pieces.queen:
        return <SVGS.Queen colour={pieceColour} />;
      case Strings.pieces.rook:
        return <SVGS.Rook colour={pieceColour} />;
      default:
        return null;
    }
  }

  render() {
    const { name, colour, isDragging } = this.props;

    return (
      <div
        aria-label={`${colour} ${name}`}
        className={classNames('piece', {
          [`${colour}-${name}`]: true,
          'piece--dragging': isDragging
        })}
      >
        {this.renderCoolChessPieceSvg(name, colour)}
      </div>
    );
  }
}

export default withDragSource(Piece);
