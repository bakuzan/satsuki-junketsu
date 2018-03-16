import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from './Board';
import Graveyard from './Graveyard';
import MoveList from './MoveList';
import Playback from './Playback';

import { resetBoard } from 'actions/board';
import { exportPGNForMoves } from 'utils/exportImport';

const GameAction = ({ children, ...props }) => (
  <button type="button" className="button ripple primary" {...props}>
    {children}
  </button>
);

const ChessGame = ({ moves, actions }) => (
  <React.Fragment>
    <MoveList />
    <div id="chess-game-actions" className="button-group right">
      <GameAction id="new-game" onClick={actions.resetBoard}>
        New Game
      </GameAction>
      <GameAction id="export-game" onClick={() => exportPGNForMoves(moves)}>
        Export
      </GameAction>
    </div>
    <div id="chess-game" className="row">
      <div>
        <div id="chess-game-status" />
        <Board />
        <Playback />
      </div>
      <Graveyard />
    </div>
  </React.Fragment>
);

const mapStateToProps = state => ({
  moves: state.board.moves
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ resetBoard }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChessGame);
