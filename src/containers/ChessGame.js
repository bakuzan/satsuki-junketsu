import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from './Board';
import Graveyard from './Graveyard';
import MoveList from './MoveList';
import Playback from './Playback';

import { resetBoard, importGame } from 'actions/board';
import { exportPGNForMoves } from 'utils/exportImport';

const MAX_WIDTH_FALLBACK = '525px';
const GameAction = ({ children, ...props }) => (
  <button type="button" className="button ripple primary" {...props}>
    {children}
  </button>
);

class ChessGame extends React.Component {
  constructor(props) {
    super(props);

    this.fileSelector = React.createRef();
    this.gameElement = React.createRef();
    this.handleImport = this.handleImport.bind(this);
  }

  async handleImport(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const fileText = await new Response(file).text();
    this.props.actions.importGame(fileText);
  }

  getBoardWidth() {
    return (
      (this.gameElement.current && this.gameElement.current.clientHeight) ||
      MAX_WIDTH_FALLBACK
    );
  }

  render() {
    const { moves, actions } = this.props;
    console.log(this.gameElement, this.gameElement.clientHeight);
    const boardContainerStyle = {
      maxWidth: this.getBoardWidth()
    };

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
              ref={this.fileSelector}
              type="file"
              accept=".pgn"
              onChange={this.handleImport}
            />
          </label>
        </div>
        <div id="chess-game" ref={this.getGameContainer}>
          <div className="left-column">
            <div id="chess-game-status" />
            <div id="chess-game-inner-wrapper" style={boardContainerStyle}>
              <Board />
            </div>
            <Playback />
          </div>
          <div className="right-column">
            <Graveyard />
          </div>
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
