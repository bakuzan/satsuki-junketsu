import React from 'react';
import classNames from 'classnames';

import Strings from 'constants/strings';
import SVGS from './pieceSvgs';

import './piece.css';

function renderCoolChessPieceSvg(pieceName, pieceColour) {
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

const Piece = ({ name, colour }) => (
  <div className={classNames('piece', { [`${colour}-${name}`]: true })}>
    {renderCoolChessPieceSvg(name, colour)}
  </div>
);

export default Piece;
