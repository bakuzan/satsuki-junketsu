import React from 'react';

import Strings from 'constants/strings';

const VIEW_BOX = '-2 0 50 50';
const PIECE_SIZE = '100%';
const setColour = (c) =>
  c === Strings.colours.white
    ? Strings.colours.whiteHex
    : Strings.colours.blackHex;

function colourSettingsForPieces(pieceName, colourString) {
  const isWhite = colourString === Strings.colours.white;
  const oppositeColourString = isWhite
    ? Strings.colours.black
    : Strings.colours.white;
  const colour = setColour(colourString);
  const oppositeColour = setColour(oppositeColourString);

  switch (pieceName) {
    case Strings.pieces.bishop:
      return {
        outline: { fill: colour },
        detail: { stroke: oppositeColour }
      };
    case Strings.pieces.king:
      return {
        topCap: { fill: colour },
        mainBody: { fill: colour },
        lines: { stroke: oppositeColour }
      };
    case Strings.pieces.knight:
      return {
        face: { fill: oppositeColour, stroke: oppositeColour },
        mane: { fill: oppositeColour },
        mainBody: { fill: colour }
      };
    case Strings.pieces.pawn:
      return { fill: colour };
    case Strings.pieces.queen:
      return { isWhite, mainBody: { fill: colour } };
    case Strings.pieces.rook:
      return { fill: colour };
    default:
      return {};
  }
}

export default function withColour(WrappedPiece) {
  class PieceSvgWrapper extends React.Component {
    render() {
      const colourSettings = colourSettingsForPieces(
        WrappedPiece.displayName,
        this.props.colour
      );
      return (
        <WrappedPiece
          size={PIECE_SIZE}
          viewBox={VIEW_BOX}
          styleSettings={colourSettings}
        />
      );
    }
  }

  return PieceSvgWrapper;
}
