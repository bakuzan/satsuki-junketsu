const getSquare = n => document.getElementById(n);
const selectSquare = n =>
  (getSquare(n) || { click: () => console.log('nothing to click') }).click();
const moveFromSquareToSquare = async (n, m) => {
  await selectSquare(n);
  await selectSquare(m);
};

const prepareBoard = arr => moveFromSquareToSquare(...arr);
const makeMoves = arr => {
  const move = arr.pop();
  if (!move) return console.log('board ready');

  let timer;
  clearTimeout(timer);
  timer = setTimeout(() => {
    prepareBoard(move);
    makeMoves(arr);
  }, 200);
};

// fastest checkmate
let fastestGame = [[53, 37], [12, 28], [54, 38], [3, 39]].reverse();

// check at index 3
let check = [[53, 45], [12, 28], [45, 37], [3, 39], [54, 46]].reverse();

// castling tests
let castling = [].reverse();

// en passant test
let enPassant = [[51, 35], [8, 16], [35, 27], [12, 28], [27]].reverse();

// promotion tests
let promotion = [
  [54, 38],
  [15, 31],
  [38, 31],
  [7, 23],
  [53, 45],
  [23, 22],
  [31, 23],
  [22, 21],
  [23, 15],
  [21, 20],
  [15]
].reverse();

export default {
  makeMoves,
  movesFor: {
    fastestGame,
    check,
    castling,
    enPassant,
    promotion
  },
  examples: {
    promotion: () => makeMoves(promotion),
    enPassant: () => makeMoves(enPassant)
  }
};
