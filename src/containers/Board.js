import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from 'components/board/Board';

import * as actions from 'actions/board';
import { isWhitesTurn } from 'utils/game';
import { possibleMovesForSelectedPiece, getCheckMoves } from 'utils/piece';

const mapStateToProps = state => ({
  ...state.board,
  potentialMoves: possibleMovesForSelectedPiece(state.board),
  checkMoves: getCheckMoves(state.board.squares),
  isReversed: !isWhitesTurn(state.board.moves.length)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);
