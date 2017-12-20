import { createReducer } from './utils';
import { buildStartingBoard } from 'utils/board';

import { BOARD_SELECT_SQUARE } from 'actions/board';

const initialState = {
  moves: [],
  squares: buildStartingBoard(),
  selectedSquareId: null
};

const board = createReducer(initialState, {
  [BOARD_SELECT_SQUARE]: (state, action) => ({
    ...state,
    selectedSquareId: action.squareId
  })
});

export default board;
