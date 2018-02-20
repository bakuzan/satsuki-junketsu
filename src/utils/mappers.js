export const mapPieceToMovedPiece = p => ({ ...p, hasMoved: true });

const squarePosition = ({ rank, file }) => ({ rank, file });
export const mapSquaresToMove = (oldSquare, newSquare) => ({
  from: squarePosition(oldSquare),
  to: squarePosition(newSquare),
  piece: mapPieceToMovedPiece(newSquare.contains)
});

export const mapPieceToNewSquare = (currentSquare, targetSquare) => ({
  ...targetSquare,
  contains: {
    ...currentSquare.contains
  }
});
