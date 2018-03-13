import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from './Board';
import Graveyard from './Graveyard';
import MoveList from './MoveList';
import Playback from './Playback';

import { resetBoard } from 'actions/board';

const ChessGame = ({ actions }) => (
  <React.Fragment>
    <MoveList />
    <div id="chess-game-actions" className="button-group right">
      <button
        type="button"
        className="button ripple primary"
        onClick={actions.resetBoard}
      >
        New Game
      </button>
    </div>
    <div id="chess-game" className="row">
      <div>
        <div id="chess-game-status" />
        <Board />
      </div>
      <Graveyard />
    </div>
    <Playback />
  </React.Fragment>
);

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ resetBoard }, dispatch)
});

export default connect(null, mapDispatchToProps)(ChessGame);
