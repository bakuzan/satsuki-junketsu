import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from './Board';
import Graveyard from './Graveyard';
import MoveList from './MoveList';
import Playback from './Playback';

import { resetBoard, importGame } from 'actions/board';
import { exportPGNForMoves } from 'utils/exportImport';

const GameAction = ({ children, ...props }) => (
  <button type="button" className="button ripple primary" {...props}>
    {children}
  </button>
);

class ChessGame extends React.Component {
  constructor(props) {
    super(props);
    this.fileSelector = null;

    this.handleImport = this.handleImport.bind(this);
  }

  async handleImport(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const fileText = await new Response(file).text();
    this.props.actions.importGame(fileText);
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
          <label
            id="import-game"
            role="button"
            className="button ripple primary"
          >
            Import
            <input
              ref={el => (this.fileSelector = el)}
              type="file"
              accept=".pgn"
              onChange={this.handleImport}
            />
          </label>
        </div>
        <div id="chess-game" className="row">
          <div id="chess-game-inner-wrapper">
            <div>
              <div id="chess-game-status" />
              <Board />
              <Playback />
            </div>
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
  actions: bindActionCreators({ resetBoard, importGame }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChessGame);
