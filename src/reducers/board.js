import { createReducer } from './utils';
import { buildStartingBoard } from 'utils/board';

const initialState = {
  squares: buildStartingBoard()
};

const board = createReducer(initialState, {});

export default board;
