import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from 'components/board/Board';

import { SLIDER_END } from 'constants/slider';
import * as actions from 'actions/board';
import { isWhitesTurn, getCurrentPlayerColour } from 'utils/game';
import {
  possibleMovesForSelectedPiece,
  getCheckStatusForColour
} from 'utils/piece';
import availableSpecialMovesForSelectedPiece from 'utils/special-moves';
import {
  getMoveIndexForPlayback,
  selectNextMoveSquareId,
  createBoardLayoutForMoveList
} from 'utils/playback';

const BoardContainer = ({ board, ...props }) => {
  const isReadOnly = board.playback.sliderPosition !== SLIDER_END;
  /*  For Playback
   *  Here we need to calculate the moves, squares, and set the selectedSquareId
   *  for the currently active move according to the playback.sliderPosition
  */
  const activeMoveIndex = getMoveIndexForPlayback(board.moves, board.playback);
  const moves = board.moves.slice(0, activeMoveIndex);
  const selectedSquareId = !isReadOnly
    ? board.selectedSquareId
    : selectNextMoveSquareId(board.moves, activeMoveIndex);
  const squares = !isReadOnly
    ? board.squares
    : createBoardLayoutForMoveList(moves);
  const currentBoardForDisplay = {
    ...board,
    selectedSquareId,
    moves,
    squares
  };

  const currentPlayerColour = getCurrentPlayerColour(moves);
  const potentialMoves = possibleMovesForSelectedPiece(currentBoardForDisplay);
  const specialMoves = availableSpecialMovesForSelectedPiece(
    currentBoardForDisplay
  );
  const checkStatus = getCheckStatusForColour(currentPlayerColour, squares);
  const isReversed = !isWhitesTurn(moves.length);

  return (
    <Board
      {...props}
      {...currentBoardForDisplay}
      currentPlayerColour={currentPlayerColour}
      potentialMoves={potentialMoves}
      specialMoves={specialMoves}
      checkStatus={checkStatus}
      isReversed={isReversed}
      isReadOnly={isReadOnly}
    />
  );
};

const mapStateToProps = state => ({
  themeClass: state.theme.board,
  board: state.board
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
