import { createReducer } from './utils';
import { compose, getSavedGame, persistChessGame } from 'utils/common';
import { buildStartingBoard } from 'utils/board';
import performMovementFromCurrentToTarget from 'utils/squaresUpdate';

import {
  BOARD_SELECT_SQUARE,
  BOARD_MOVE_PIECE,
  BOARD_TAKE_PIECE,
  BOARD_SPECIAL_MOVE,
  BOARD_RESET,
  BOARD_IMPORT_GAME,
  BOARD_SAVE_GAME,
  BOARD_LOAD_GAME
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

const initialState = {
  graveyard: [],
  moves: [],
  squares: buildStartingBoard(),
  selectedSquareId: null,
  promotionAt: null,
  playback: getPlaybackInitialState(PLAYBACK_STARTING_VALUE)
};

const updateSlideMaximum = state => ({
  ...state,
  playback: getPlaybackInitialState(state.moves.length)
});

const handlePieceMovement = (state, action) =>
  performMovementFromCurrentToTarget(
    state,
    state.selectedSquareId,
    action.targetSquareId
  );

const handleImport = freshState => (state, action) =>
  importSubReducer(freshState, action);

const composedPieceMovement = compose(updateSlideMaximum, handlePieceMovement);
const composedSpecialMove = compose(updateSlideMaximum, specialMoveSubReducer);
const composedImport = compose(updateSlideMaximum, handleImport(initialState));

const board = createReducer(initialState, {
  [BOARD_SELECT_SQUARE]: (state, action) => ({
    ...state,
    selectedSquareId: action.squareId
  }),
  [BOARD_MOVE_PIECE]: composedPieceMovement,
  [BOARD_TAKE_PIECE]: composedPieceMovement,
  [BOARD_SPECIAL_MOVE]: composedSpecialMove,
  [PLAYBACK_UPDATE_SLIDE_POSITION]: playbackSubReducer,
  [PLAYBACK_STEP_FORWARD]: playbackSubReducer,
  [PLAYBACK_STEP_BACK]: playbackSubReducer,
  [BOARD_IMPORT_GAME]: composedImport,
  [BOARD_RESET]: () => initialState,
  [BOARD_SAVE_GAME]: state => persistChessGame(state),
  [BOARD_LOAD_GAME]: state => {
    const savedGame = getSavedGame();
    if (savedGame) return savedGame;
    console.info('%c No saved game found.', 'color: royalblue');
    return state;
  }
});

export default board;
