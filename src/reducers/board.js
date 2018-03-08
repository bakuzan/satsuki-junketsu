import { createReducer } from './utils';
import { buildStartingBoard } from 'utils/board';
import {
  mapSquaresToMove,
  mapPieceToMovedPiece,
  mapPieceToNewSquare
} from 'utils/mappers';

import {
  BOARD_SELECT_SQUARE,
  BOARD_MOVE_PIECE,
  BOARD_TAKE_PIECE,
  BOARD_SPECIAL_MOVE
} from 'actions/board';
import specialMoveSubReducer from './board-special-move';

const initialState = {
  graveyard: [],
  moves: [],
  squares: buildStartingBoard(),
  selectedSquareId: null
};

const board = createReducer(initialState, {
  [BOARD_SELECT_SQUARE]: (state, action) => ({
    ...state,
    selectedSquareId: action.squareId
  }),
  [BOARD_MOVE_PIECE]: (state, action) => {
    const currentSquare = state.squares.find(
      x => x.id === state.selectedSquareId
    );
    const targetIndex = state.squares.findIndex(
      x => x.id === action.targetSquareId
    );
    const contains = mapPieceToMovedPiece(currentSquare.contains);
    const squares = mapPieceToNewSquare(state.squares, targetIndex, {
      ...currentSquare,
      contains
    });

    return {
      ...state,
      squares,
      selectedSquareId: null,
      moves: [
        ...state.moves,
        mapSquaresToMove(currentSquare, squares[targetIndex])
      ]
    };
  },
  [BOARD_TAKE_PIECE]: (state, action) => {
    const currentSquare = state.squares.find(
      x => x.id === state.selectedSquareId
    );
    const targetIndex = state.squares.findIndex(
      x => x.id === action.targetSquareId
    );
    const attackingPiece = mapPieceToMovedPiece(currentSquare.contains);
    const defendingPiece = { ...state.squares[targetIndex].contains };
    const squares = mapPieceToNewSquare(state.squares, targetIndex, {
      ...currentSquare,
      contains: attackingPiece
    });

    return {
      ...state,
      squares,
      selectedSquareId: null,
      moves: [
        ...state.moves,
        mapSquaresToMove(currentSquare, squares[targetIndex])
      ],
      graveyard: [...state.graveyard, defendingPiece]
    };
  },
  [BOARD_SPECIAL_MOVE]: specialMoveSubReducer
});

export default board;
