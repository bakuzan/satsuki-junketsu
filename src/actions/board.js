export const BOARD_SELECT_SQUARE = 'BOARD_SELECT_SQUARE';
export const selectBoardSquare = squareId => ({
  type: BOARD_SELECT_SQUARE,
  squareId
});

export const BOARD_MOVE_PIECE = 'BOARD_MOVE_PIECE';
export const moveSelectedPiece = targetSquareId => ({
  type: BOARD_MOVE_PIECE,
  targetSquareId
});

export const BOARD_TAKE_PIECE = 'BOARD_TAKE_PIECE';
export const takePiece = targetSquareId => ({
  type: BOARD_TAKE_PIECE,
  targetSquareId
});
