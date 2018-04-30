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

const getCurrentMovesForPlaybackPosition = state => {
  const activeMoveIndex = state.board.playback.sliderPosition;
  return state.board.moves.slice(0, activeMoveIndex);
};

const getPiecesForColour = (state, colour) => {
  const moves = getCurrentMovesForPlaybackPosition(state);
  return state.board.graveyard.filter(
    x =>
      x.colour === colour &&
      moves.some(y => y.captured && y.captured.id === x.id)
  );
};

const resolveBoardDirection = state => {
  const moves = getCurrentMovesForPlaybackPosition(state);
  return state.board.reverseBoard && !isWhitesTurn(moves.length);
};

const mapStateToProps = state => ({
  isReversed: resolveBoardDirection(state),
  whitePieces: getPiecesForColour(state, Constants.Strings.colours.white),
  blackPieces: getPiecesForColour(state, Constants.Strings.colours.black)
});

export default connect(mapStateToProps)(DualGraveyards);
