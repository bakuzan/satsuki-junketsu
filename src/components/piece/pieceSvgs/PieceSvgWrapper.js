import React from 'react';

import Strings from 'constants/strings';

const PIECE_SIZE = 45;
const setColour = c => (c === Strings.colours.white ? '#ffffff' : '#000000');

function colourSettingsForPieces(pieceName, colourString) {
  const oppositeColourString =
    colourString === Strings.colours.white
      ? Strings.colours.black
      : Strings.colours.white;
  const colour = setColour(colourString);
  const oppositeColour = setColour(oppositeColourString);

  switch (pieceName.toLowerCase()) {
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
      return {
        mainBody: { fill: colour, stroke: oppositeColour },
        circles: { fill: colour },
        spikes: { stroke: oppositeColour },
        crownLines: { fill: oppositeColour },
        baseline: { stroke: oppositeColour }
      };
    case Strings.pieces.rook:
      return {
        mainBody: { fill: colour }
      };
    default:
      return {};
  }
}

export default function withColour(WrappedPiece) {
  class PieceSvgWrapper extends React.Component {
    render() {
      const colourSettings = colourSettingsForPieces(
        WrappedPiece.name,
        this.props.colour
      );
      return <WrappedPiece size={PIECE_SIZE} styleSettings={colourSettings} />;
    }
  }

  return PieceSvgWrapper;
}
