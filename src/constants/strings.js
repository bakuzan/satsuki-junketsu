const colours = {
  white: 'white',
  black: 'black'
};
const pieces = {
  pawn: 'pawn',
  rook: 'rook',
  knight: 'knight',
  bishop: 'bishop',
  queen: 'queen',
  king: 'king'
};

const specialMoves = {
  promotionSelection: 'PROMOTION_SELECT',
  promotion: 'PROMOTION_COMPLETE',
  enPassant: 'EN_PASSANT',
  castling: 'CASTLING'
};

const pgn = {
  piece: {
    king: 'K',
    queen: 'Q',
    bishop: 'B',
    knight: 'N',
    rook: 'R',
    pawn: ''
  },
  capture: 'x',
  promotion: '=',
  castle: { king: 'O-O', queen: 'O-O-O' },
  check: '+',
  checkmate: '#'
};

const castling = {
  kingTargets: ['c', 'g'],
  rookStarts: ['a', 'h'],
  rookEnds: ['d', 'f']
};

const Strings = {
  localUserSettings: 'satsukiUserSettings',
  colours,
  pieces,
  specialMoves,
  castling,
  pgn
};

export default Strings;
