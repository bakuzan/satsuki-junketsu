import { createReducer } from './utils';
import { buildStartingBoard } from 'utils/board';
import performMovementFromCurrentToTarget from 'utils/squaresUpdate';

import {
  BOARD_SELECT_SQUARE,
  BOARD_MOVE_PIECE,
  BOARD_TAKE_PIECE,
  BOARD_SPECIAL_MOVE,
  BOARD_RESET,
  BOARD_IMPORT_GAME
} from 'actions/board';
import {
  PLAYBACK_UPDATE_SLIDE_POSITION,
  PLAYBACK_STEP_FORWARD,
  PLAYBACK_STEP_BACK
} from 'actions/playback';
import specialMoveSubReducer from './board-specialMove';
import playbackSubReducer, { playbackInitialState } from './board-playback';
import importSubReducer from './board-import';

const initialState = {
  graveyard: [],
  moves: [],
  squares: buildStartingBoard(),
  selectedSquareId: null,
  promotionAt: null,
  playback: playbackInitialState
};

const handlePieceMovement = (state, action) =>
  performMovementFromCurrentToTarget(
    state,
    state.selectedSquareId,
    action.targetSquareId
  );

const board = createReducer(initialState, {
  [BOARD_SELECT_SQUARE]: (state, action) => ({
    ...state,
    selectedSquareId: action.squareId
  }),
  [BOARD_MOVE_PIECE]: handlePieceMovement,
  [BOARD_TAKE_PIECE]: handlePieceMovement,
  [BOARD_SPECIAL_MOVE]: specialMoveSubReducer,
  [PLAYBACK_UPDATE_SLIDE_POSITION]: playbackSubReducer,
  [PLAYBACK_STEP_FORWARD]: playbackSubReducer,
  [PLAYBACK_STEP_BACK]: playbackSubReducer,
  [BOARD_IMPORT_GAME]: (state, action) =>
    importSubReducer(initialState, action),
  [BOARD_RESET]: () => initialState
});

export default board;
