import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Board from './Board';
import Graveyard from './Graveyard';
import MoveList from './MoveList';
import Playback from './Playback';
import MaintainAspectRatio from './MaintainAspectRatio';
import GameAction from 'components/GameAction';
import NewGameOptions from 'components/newGameOptions';

import { resetBoard, importGame, saveGame, loadGame } from 'actions/board';
import { exportPGNForMoves } from 'utils/exportImport';

const ACTIONS_ID = 'chess-game-actions';

class ChessGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStartingNewGame: false
    };

    this.fileSelector = React.createRef();
    this.handleImport = this.handleImport.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadGame();
  }

  async handleImport(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const fileText = await new Response(file).text();
    this.props.actions.importGame(fileText);
  }

  handleNewGame(option) {
    if (!this.state.isStartingNewGame) {
      this.setState({ isStartingNewGame: true });
    } else {
      this.setState({ isStartingNewGame: false }, () =>
        this.props.actions.resetBoard(option)
      );
    }
  }

  render() {
    const { moves, vsComputer, actions } = this.props;

    return (
      <React.Fragment>
        <MoveList />
        <div id={ACTIONS_ID} className="button-group right">
          <GameAction id="new-game" onClick={this.handleNewGame}>
            New Game
          </GameAction>
          <GameAction id="save-game" onClick={actions.saveGame}>
            Save Game
          </GameAction>
          <GameAction
            id="export-game"
            onClick={() => exportPGNForMoves(moves, vsComputer)}
          >
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
          <MaintainAspectRatio>
            {(ref, style) => (
              <div ref={ref} className="left-column">
                <div id="chess-game-status" />
                <Board style={style} />
                <Playback />
              </div>
            )}
          </MaintainAspectRatio>
          <div className="right-column">
            <Graveyard />
          </div>
        </div>
        <NewGameOptions
          targetSelector={`#${ACTIONS_ID}`}
          display={this.state.isStartingNewGame}
          onSelect={this.handleNewGame}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  moves: state.board.moves,
  vsComputer: state.board.vsComputer
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { resetBoard, importGame, saveGame, loadGame },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(ChessGame);
