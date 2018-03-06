import Strings from 'constants/strings';

import { mapSquareIdToPromotion } from './mappers';
import { possibleMovesForSelectedPiece } from './piece';

const BLACK_BACK_ROW = 8;
const WHITE_BACK_ROW = 1;

function checkPawnPromotion(pawnSquare, squares) {
  const colour = pawnSquare.contains.colour;
  const targetRank =
    colour === Strings.colours.white ? BLACK_BACK_ROW : WHITE_BACK_ROW;
  if (Math.abs(pawnSquare.rank - targetRank) !== 1) return [];
  return possibleMovesForSelectedPiece({
    selectedSquareId: pawnSquare.id,
    squares
  }).map(mapSquareIdToPromotion);
}

function checkPawnEnPassant() {
  return [];
}

function pawnSpecialMoves(pawnSquare, squares) {
  return [...checkPawnPromotion(pawnSquare, squares), ...checkPawnEnPassant()];
}

function kingSpecialMoves(kingSquare, squares) {
  if (kingSquare.contains.hasMoved) return [];
  const rookSquares = squares.filter(
    x =>
      x.contains &&
      x.contains.name === Strings.pieces.rook &&
      x.contains.colour === kingSquare.contains.colour &&
      !x.contains.hasMoved
  );
  if (!rookSquares.length) return [];
  // no pieces between king and rook
  // king cannot move through or into check
}

function availableSpecialMovesForSelectedPiece(boardState) {
  const { squares, selectedSquareId } = boardState;
  const square = squares.find(x => x.id === selectedSquareId);
  if (!square) return [];

  switch (square.contains.name) {
    case Strings.pieces.pawn:
      return pawnSpecialMoves(square, squares);
    case Strings.pieces.king:
      return kingSpecialMoves(square, squares);
    default:
      return [];
  }
}

export default availableSpecialMovesForSelectedPiece;
