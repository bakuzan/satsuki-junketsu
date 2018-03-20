import {
  mapSquaresToMove,
  mapPieceToMovedPiece,
  mapPieceToNewSquare
} from './mappers';

function performMovementFromCurrentToTarget(
  oldState,
  fromSquareId,
  toSquareId,
  specialMove
) {
  const currentSquare = oldState.squares.find(x => x.id === fromSquareId);
  const targetIndex = oldState.squares.findIndex(x => x.id === toSquareId);
  const movingPiece = mapPieceToMovedPiece(currentSquare.contains);
  const defendingPiece = !!oldState.squares[targetIndex].contains
    ? { ...oldState.squares[targetIndex].contains }
    : null;

  const squares = mapPieceToNewSquare(oldState.squares, targetIndex, {
    ...currentSquare,
    contains: movingPiece
  });
  const moves = [
    ...oldState.moves,
    mapSquaresToMove(
      currentSquare,
      squares[targetIndex],
      squares,
      defendingPiece,
      specialMove
    )
  ];
  const graveyard = !!defendingPiece
    ? [...oldState.graveyard, defendingPiece].filter(x => !!x)
    : oldState.graveyard;
  return {
    ...oldState,
    selectedSquareId: null,
    squares,
    moves,
    graveyard
  };
}

export default performMovementFromCurrentToTarget;
