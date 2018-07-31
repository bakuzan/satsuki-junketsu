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
    const { vsComputer, moves } = this.props.board;
    const { isComputer, isBlack } = vsComputer;
    const isWhite = isWhitesTurn(moves.length);
    const notComputerTurn = (isBlack && isWhite) || (!isBlack && !isWhite);

    if (!isComputer || notComputerTurn) return;
    console.log('CDU > ', this.props, this.state);
    // TODO handle special moves!!
    const computerSelected = SJEngine.selectNextMove(this.props.board);
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
