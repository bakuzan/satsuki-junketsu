import Strings from 'constants/strings';
import { getCurrentCheckStatusAfterMove } from './piece';
import { updateArrayPreservingOrder } from './common';

export const mapPieceToMovedPiece = p => ({ ...p, hasMoved: true });

const squarePosition = ({ rank, file }) => ({ rank, file });
export const mapSquaresToMove = (
  oldSquare,
  newSquare,
  squaresAfterMove,
  captured,
  specialMove
) => ({
  from: squarePosition(oldSquare),
  to: squarePosition(newSquare),
  piece: mapPieceToMovedPiece(newSquare.contains),
  checkStatus: getCurrentCheckStatusAfterMove(
    newSquare.contains,
    squaresAfterMove
  ),
  captured,
  specialMove
});

export const mapPieceToNewSquare = (squares, index, currentSquare) => {
  const oldIndex = squares.findIndex(x => x.id === currentSquare.id);
  return updateArrayPreservingOrder(
    updateArrayPreservingOrder(squares, index, {
      contains: currentSquare.contains
    }),
    oldIndex,
    { contains: null }
  );
};

export const mapPieceToNewPiece = (squares, index, updatedPiece) =>
  updateArrayPreservingOrder(squares, index, {
    contains: updatedPiece
      ? { ...(squares[index].contains || {}), ...updatedPiece }
      : null
  });

const mapToSpecialMove = type => squareId => ({
  type,
  squareId
});
export const mapSquareIdToPromotion = mapToSpecialMove(
  Strings.specialMoves.promotionSelection
);
export const mapSquareIdToEnPassant = mapToSpecialMove(
  Strings.specialMoves.enPassant
);
export const mapSquareIdToCastling = mapToSpecialMove(
  Strings.specialMoves.castling
);
