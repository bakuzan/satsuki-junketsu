import React from 'react';
import { connect } from 'react-redux';

import Graveyard from 'components/graveyard/Graveyard';

import Constants from 'constants/index';
import { isWhitesTurn } from 'utils/game';

const DualGraveyards = ({ isReversed, whitePieces, blackPieces }) => (
  <div id="paired-graveyards">
    <Graveyard pieces={isReversed ? blackPieces : whitePieces} />
    <Graveyard pieces={isReversed ? whitePieces : blackPieces} />
  </div>
);

const getPiecesForColour = (state, colour) => {
  const activeMoveIndex = state.board.playback.sliderPosition;
  const moves = state.board.moves.slice(0, activeMoveIndex);
  return state.board.graveyard.filter(
    x =>
      x.colour === colour &&
      moves.some(y => y.captured && y.captured.id === x.id)
  );
};

const mapStateToProps = state => ({
  isReversed: !isWhitesTurn(state.board.moves.length),
  whitePieces: getPiecesForColour(state, Constants.Strings.colours.white),
  blackPieces: getPiecesForColour(state, Constants.Strings.colours.black)
});

export default connect(mapStateToProps)(DualGraveyards);
