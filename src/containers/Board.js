import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from 'components/board/Board';

import * as actions from 'actions/board';
import { isWhitesTurn, getCurrentPlayerColour } from 'utils/game';
import {
  possibleMovesForSelectedPiece,
  getCheckStatusForColour
} from 'utils/piece';
import availableSpecialMovesForSelectedPiece from 'utils/special-moves';

class BoardContainer extends React.Component {
  render() {
    const { board } = this.props;
    const currentPlayerColour = getCurrentPlayerColour(board.moves);
    const potentialMoves = possibleMovesForSelectedPiece(board);
    const specialMoves = availableSpecialMovesForSelectedPiece(board);
    const checkStatus = getCheckStatusForColour(
      getCurrentPlayerColour(board.moves),
      board.squares
    );
    const isReversed = !isWhitesTurn(board.moves.length);

    return (
      <Board
        {...this.props}
        {...board}
        currentPlayerColour={currentPlayerColour}
        potentialMoves={potentialMoves}
        specialMoves={specialMoves}
        checkStatus={checkStatus}
        isReversed={isReversed}
        isReadOnly={false}
      />
    );
  }
}

const mapStateToProps = state => ({
  themeClass: state.theme.board,
  board: state.board
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
