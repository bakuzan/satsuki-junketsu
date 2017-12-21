import { createReducer } from './utils';
import { buildStartingBoard } from 'utils/board';
import { updateArrayPreservingOrder } from 'utils/common';
import { mapSquaresToMove, mapPieceToMovedPiece } from 'utils/mappers';

import {
  BOARD_SELECT_SQUARE,
  BOARD_MOVE_PIECE,
  BOARD_TAKE_PIECE
} from 'actions/board';

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
    const currentIndex = state.squares.findIndex(
      x => x.id === state.selectedSquareId
    );
    const contains = mapPieceToMovedPiece(state.squares[currentIndex].contains);
    const tempSquares = updateArrayPreservingOrder(
      state.squares,
      currentIndex,
      { contains: null }
    );

    const targetIndex = state.squares.findIndex(
      x => x.id === action.targetSquareId
    );
    const squares = updateArrayPreservingOrder(tempSquares, targetIndex, {
      contains
    });

    return {
      ...state,
      squares,
      selectedSquareId: null,
      moves: [
        ...state.moves,
        mapSquaresToMove(squares[currentIndex], squares[targetIndex])
      ]
    };
  },
  [BOARD_TAKE_PIECE]: (state, action) => {
    const currentIndex = state.squares.findIndex(
      x => x.id === state.selectedSquareId
    );
    const attackingPiece = mapPieceToMovedPiece(
      state.squares[currentIndex].contains
    );
    const tempSquares = updateArrayPreservingOrder(
      state.squares,
      currentIndex,
      { contains: null }
    );

    const targetIndex = state.squares.findIndex(
      x => x.id === action.targetSquareId
    );
    const defendingPiece = { ...state.squares[targetIndex].contains };
    const squares = updateArrayPreservingOrder(tempSquares, targetIndex, {
      contains: attackingPiece
    });

    return {
      ...state,
      squares,
      selectedSquareId: null,
      moves: [
        ...state.moves,
        mapSquaresToMove(squares[currentIndex], squares[targetIndex])
      ],
      graveyard: [...state.graveyard, defendingPiece]
    };
  }
});

export default board;
