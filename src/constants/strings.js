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

const Strings = {
  localUserSettings: 'satsukiUserSettings',
  colours,
  pieces,
  specialMoves
};

export default Strings;
