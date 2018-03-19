import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from './Board';
import Graveyard from './Graveyard';
import MoveList from './MoveList';
import Playback from './Playback';

import { resetBoard } from 'actions/board';
import { exportPGNForMoves, importMovesFromPGN } from 'utils/exportImport';

const GameAction = ({ children, ...props }) => (
  <button type="button" className="button ripple primary" {...props}>
    {children}
  </button>
);

class ChessGame extends React.Component {
  constructor(props) {
    super(props);
    this.fileSelector = null;

    this.openFileSelector = this.openFileSelector.bind(this);
    this.handleImport = this.handleImport.bind(this);
  }

  openFileSelector() {
    this.fileSelector.click();
  }

  handleImport(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    importMovesFromPGN(file);
  }

  render() {
    const { moves, actions } = this.props;
    return (
      <React.Fragment>
        <MoveList />
        <div id="chess-game-actions" className="button-group right">
          <GameAction id="new-game" onClick={actions.resetBoard}>
            New Game
          </GameAction>
          <GameAction id="export-game" onClick={() => exportPGNForMoves(moves)}>
            Export
          </GameAction>
          <GameAction id="import-game" onClick={this.openFileSelector}>
            Import
            <input
              ref={el => (this.fileSelector = el)}
              type="file"
              accept=".pgn"
              onChange={this.handleImport}
            />
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
  }
}

const mapStateToProps = state => ({
  moves: state.board.moves
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ resetBoard }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChessGame);
