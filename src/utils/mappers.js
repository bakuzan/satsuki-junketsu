import Strings from 'constants/strings';
import { updateArrayPreservingOrder } from './common';

export const mapPieceToMovedPiece = p => ({ ...p, hasMoved: true });

const squarePosition = ({ rank, file }) => ({ rank, file });
export const mapSquaresToMove = (oldSquare, newSquare) => ({
  from: squarePosition(oldSquare),
  to: squarePosition(newSquare),
  piece: mapPieceToMovedPiece(newSquare.contains)
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

export const mapSquareIdToPromotion = squareId => ({
  type: Strings.specialMoves.promotion,
  squareId
});
