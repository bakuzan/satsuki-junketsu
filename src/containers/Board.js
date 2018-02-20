import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from 'components/board/Board';

import * as actions from 'actions/board';
import { isWhitesTurn, getCurrentPlayerColour } from 'utils/game';
import {
  possibleMovesForSelectedPiece,
  getcheckStatusForColour
} from 'utils/piece';

const mapStateToProps = state => ({
  themeClass: state.theme.board,
  ...state.board,
  currentPlayerColour: getCurrentPlayerColour(state.board.moves),
  potentialMoves: possibleMovesForSelectedPiece(state.board),
  checkStatus: getcheckStatusForColour(
    getCurrentPlayerColour(state.board.moves),
    state.board.squares
  ),
  isReversed: !isWhitesTurn(state.board.moves.length)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
