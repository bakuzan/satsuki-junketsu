import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from 'components/board/Board';
import DragAndDropContext from 'components/dragAndDrop';

import * as actions from 'actions/board';
import { isWhitesTurn, getCurrentPlayerColour } from 'utils/game';
import {
  possibleMovesForSelectedPiece,
  getCheckStatusForColour
} from 'utils/piece';
import availableSpecialMovesForSelectedPiece from 'utils/specialMoves';
import {
  selectNextMoveSquareId,
  createBoardLayoutForMoveList
} from 'utils/playback';
import SJEngine from 'utils/engine';

class BoardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      computerSelected: null
    };
  }

  componentDidUpdate() {
    const { vsComputer, moves, squares } = this.props.board;
    const { isComputer, isComputerBlack } = vsComputer;
    const isWhite = isWhitesTurn(moves.length);
    const notComputerTurn =
      (isComputerBlack && isWhite) || (!isComputerBlack && !isWhite);

    if (!isComputer || notComputerTurn) return;

    const currentPlayerColour = getCurrentPlayerColour(moves);
    const checkStatus = getCheckStatusForColour(currentPlayerColour, squares);
    if (checkStatus && checkStatus.isCheckmate) return;

    const computerSelected = SJEngine.selectNextMove(this.props.board);
    if (!computerSelected) return;

    this.props.actions.performComputerMove(computerSelected);
  }

  render() {
    const { board, ...props } = this.props;
    const activeMoveIndex = board.playback.sliderPosition;
    const isReadOnly = activeMoveIndex !== board.moves.length;
    /*  For Playback
   *  Here we need to calculate the moves, squares, and set the selectedSquareId
   *  for the currently active move according to the playback.sliderPosition
  */
    const moves = board.moves.slice(0, activeMoveIndex);
    const [nextMove] = board.moves.slice(activeMoveIndex, activeMoveIndex + 1);

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
    const potentialMoves = possibleMovesForSelectedPiece(
      currentBoardForDisplay
    );
    const specialMoves = availableSpecialMovesForSelectedPiece(
      currentBoardForDisplay
    );
    const checkStatus = getCheckStatusForColour(currentPlayerColour, squares);
    const isReversed = board.reverseBoard && !isWhitesTurn(moves.length);

    return (
      <Board
        {...props}
        {...currentBoardForDisplay}
        currentPlayerColour={currentPlayerColour}
        nextMove={nextMove}
        potentialMoves={potentialMoves}
        specialMoves={specialMoves}
        checkStatus={checkStatus}
        isReversed={isReversed}
        isReadOnly={isReadOnly}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  themeClass: state.theme.board,
  board: state.board
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
  DragAndDropContext(BoardContainer)
);
