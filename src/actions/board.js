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
