import { createReducer } from './utils';
import { compose, getSavedGame, persistChessGame } from 'utils/common';
import { buildStartingBoard } from 'utils/board';
import performMovementFromCurrentToTarget from 'utils/squaresUpdate';
import upgradeSavedGameState from 'utils/state';
import toaster from 'utils/toaster';

import {
  BOARD_SELECT_SQUARE,
  BOARD_MOVE_PIECE,
  BOARD_TAKE_PIECE,
  BOARD_SPECIAL_MOVE,
  BOARD_RESET,
  BOARD_IMPORT_GAME,
  BOARD_SAVE_GAME,
  BOARD_LOAD_GAME,
  BOARD_TOGGLE_REVERSE
} from 'actions/board';
import {
  PLAYBACK_UPDATE_SLIDE_POSITION,
  PLAYBACK_STEP_FORWARD,
  PLAYBACK_STEP_BACK
} from 'actions/playback';
import specialMoveSubReducer from './board-specialMove';
import playbackSubReducer, {
  PLAYBACK_STARTING_VALUE,
  getPlaybackInitialState
} from './board-playback';
import importSubReducer from './board-import';
import { BOARD_COMPUTER_MOVE } from '../actions/board';

import { NewGameOptions } from 'constants/new-game-options';

const initialState = {
  reverseBoard: false,
  graveyard: [],
  moves: [],
  squares: buildStartingBoard(),
  selectedSquareId: null,
  promotionAt: null,
  playback: getPlaybackInitialState(PLAYBACK_STARTING_VALUE),
  vsComputer: {
    isComputer: true,
    isComputerBlack: true
  }
};

const setSelectedSquareId = (state, action) => ({
  ...state,
  selectedSquareId: action.squareId
});

const updateSlideMaximum = (state) => ({
  ...state,
  playback: getPlaybackInitialState(state.moves.length)
});

const handlePieceMovement = (state, action) =>
  performMovementFromCurrentToTarget(
    state,
    state.selectedSquareId,
    action.targetSquareId
  );

const handleImport = (freshState) => (state, action) =>
  importSubReducer(freshState, action);

const composedPieceMovement = compose(updateSlideMaximum, handlePieceMovement);
const composedSpecialMove = compose(updateSlideMaximum, specialMoveSubReducer);
const composedImport = compose(updateSlideMaximum, handleImport(initialState));

const board = createReducer(initialState, {
  [BOARD_SELECT_SQUARE]: setSelectedSquareId,
  [BOARD_MOVE_PIECE]: composedPieceMovement,
  [BOARD_TAKE_PIECE]: composedPieceMovement,
  [BOARD_SPECIAL_MOVE]: composedSpecialMove,
  [PLAYBACK_UPDATE_SLIDE_POSITION]: playbackSubReducer,
  [PLAYBACK_STEP_FORWARD]: playbackSubReducer,
  [PLAYBACK_STEP_BACK]: playbackSubReducer,
  [BOARD_IMPORT_GAME]: composedImport,
  [BOARD_RESET]: (state, action) => {
    const { option } = action;
    if (option === NewGameOptions.vsComputerYouBlack)
      return {
        ...initialState,
        vsComputer: { ...initialState.vsComputer, isComputerBlack: false }
      };
    if (option === NewGameOptions.vsPlayer)
      return {
        ...initialState,
        vsComputer: { ...initialState.vsComputer, isComputer: false }
      };

    return initialState;
  },
  [BOARD_SAVE_GAME]: (state) => {
    const newState = persistChessGame(state);
    toaster.success('Saved Game');
    return newState;
  },
  [BOARD_LOAD_GAME]: (state) => {
    const savedGame = getSavedGame();
    if (!savedGame) return state;

    toaster.success('Loaded Game');
    return upgradeSavedGameState(savedGame);
  },
  [BOARD_TOGGLE_REVERSE]: (state) => ({
    ...state,
    reverseBoard: !state.reverseBoard
  }),
  [BOARD_COMPUTER_MOVE]: (state, action) => {
    const { fromId, toId } = action.move;
    const midState = setSelectedSquareId(state, { squareId: fromId });
    return composedPieceMovement(midState, { targetSquareId: toId });
  }
});

export default board;
