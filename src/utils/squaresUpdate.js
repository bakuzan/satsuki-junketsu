import Strings from 'constants/strings';
import {
  mapSquaresToMove,
  mapPieceToMovedPiece,
  mapPieceToNewSquare,
  mapPieceToNewPiece
} from './mappers';

export default function performMovementFromCurrentToTarget(
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

export function performRookMovementForCastling(currentSquares, kingSquareId) {
  const newKingSquare = currentSquares.find(x => x.id === kingSquareId);
  const rookFileIndex = Strings.castling.kingTargets.findIndex(
    x => x === newKingSquare.file
  );
  const rookSquare = currentSquares.find(
    x =>
      x.rank === newKingSquare.rank &&
      x.file === Strings.castling.rookStarts[rookFileIndex]
  );
  const rookTargetIndex = currentSquares.findIndex(
    x =>
      x.rank === newKingSquare.rank &&
      x.file === Strings.castling.rookEnds[rookFileIndex]
  );
  const movingRook = mapPieceToMovedPiece(rookSquare.contains);
  const squares = mapPieceToNewSquare(currentSquares, rookTargetIndex, {
    ...rookSquare,
    contains: movingRook
  });

  return squares;
}

export function updateBoardToRemovePassedPawn(oldState, movedPieceSquareId) {
  const movedToSquare = oldState.squares.find(x => x.id === movedPieceSquareId);
  const direction =
    movedToSquare.contains.colour === Strings.colours.white ? 1 : -1;
  const offsetRank = movedToSquare.rank - direction;
  const passedSquareIndex = oldState.squares.findIndex(
    x => x.file === movedToSquare.file && x.rank === offsetRank
  );
  const passedPiece = {
    ...oldState.squares[passedSquareIndex].contains
  };
  const squares = mapPieceToNewPiece(oldState.squares, passedSquareIndex, null);
  const moveIndex = oldState.moves.length - 1;
  const moves = [
    ...oldState.moves.slice(0, moveIndex),
    {
      ...oldState.moves[moveIndex],
      captured: { ...passedPiece }
    }
  ];

  return {
    ...oldState,
    squares,
    moves,
    graveyard: [...oldState.graveyard, passedPiece]
  };
}

export function updateSquaresToRemovePassedPawn(squares, movedPieceSquareId) {
  const fakeStateWithNewSquares = updateBoardToRemovePassedPawn(
    { moves: [], graveyard: [], squares },
    movedPieceSquareId
  );
  return fakeStateWithNewSquares.squares;
}
