export const BOARD_SELECT_SQUARE = 'BOARD_SELECT_SQUARE';
export const selectBoardSquare = (squareId) => ({
  type: BOARD_SELECT_SQUARE,
  squareId
});

export const BOARD_MOVE_PIECE = 'BOARD_MOVE_PIECE';
export const moveSelectedPiece = (targetSquareId) => ({
  type: BOARD_MOVE_PIECE,
  targetSquareId
});

export const BOARD_TAKE_PIECE = 'BOARD_TAKE_PIECE';
export const takePiece = (targetSquareId) => ({
  type: BOARD_TAKE_PIECE,
  targetSquareId
});

export const BOARD_SPECIAL_MOVE = 'BOARD_SPECIAL_MOVE';
export const performSpecialMove = (specialMove) => ({
  type: BOARD_SPECIAL_MOVE,
  specialMove
});

export const BOARD_RESET = 'BOARD_RESET';
export const resetBoard = () => ({
  type: BOARD_RESET
});

export const BOARD_IMPORT_GAME = 'BOARD_IMPORT_GAME';
export const importGame = (fileText) => ({
  type: BOARD_IMPORT_GAME,
  fileText
});

export const BOARD_SAVE_GAME = 'BOARD_SAVE_GAME';
export const saveGame = () => ({
  type: BOARD_SAVE_GAME
});

export const BOARD_LOAD_GAME = 'BOARD_LOAD_GAME';
export const loadGame = () => ({
  type: BOARD_LOAD_GAME
});

export const BOARD_TOGGLE_REVERSE = 'BOARD_TOGGLE_REVERSE';
export const toggleReverseBoard = () => ({
  type: BOARD_TOGGLE_REVERSE
});

export const BOARD_COMPUTER_MOVE = 'BOARD_COMPUTER_MOVE';
export const performComputerMove = (move) => ({
  type: BOARD_COMPUTER_MOVE,
  move
});
