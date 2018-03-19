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

export const BOARD_SPECIAL_MOVE = 'BOARD_SPECIAL_MOVE';
export const performSpecialMove = specialMove => ({
  type: BOARD_SPECIAL_MOVE,
  specialMove
});

export const BOARD_RESET = 'BOARD_RESET';
export const resetBoard = () => ({
  type: BOARD_RESET
});

export const BOARD_IMPORT_GAME = 'BOARD_IMPORT_GAME';
export const importGame = fileText => ({
  type: BOARD_IMPORT_GAME,
  fileText
});
