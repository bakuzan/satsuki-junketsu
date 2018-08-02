import { possibleMovesForSelectedPiece } from 'utils/piece';
import availableSpecialMovesForSelectedPiece from 'utils/specialMoves';

export function getPossibleMovesForPiece(board, squares, squareId) {
  const fakeBoardState = {
    ...board,
    selectedSquareId: squareId,
    squares
  };
  return {
    possibleMoves: possibleMovesForSelectedPiece(fakeBoardState),
    possibleSMoves: availableSpecialMovesForSelectedPiece(fakeBoardState)
  };
}

export function getAllUniquePossibleMoves(board, pSquares, isCurrent = true) {
  const { moves, squares } = board;
  const fakeMoves = isCurrent ? moves : moves.slice(1);
  const fakeBoard = {
    ...board,
    moves: fakeMoves
  };
  const ids = pSquares.reduce((acc, sq) => {
    const { possibleMoves, possibleSMoves } = getPossibleMovesForPiece(
      fakeBoard,
      squares,
      sq.id
    );
    return [...acc, ...possibleMoves, ...possibleSMoves];
  }, []);

  return new Set(ids);
}
