import Strings from 'constants/strings';

import { isValidMove, isValidTake } from 'utils/game';
import { importPGNFromFile } from 'utils/exportImport';
import {
  mapPieceToMovedPiece,
  mapPieceToNewSquare,
  mapSquaresToMove
} from 'utils/mappers';
import {
  performRookMovementForCastling,
  updateBoardToRemovePassedPawn
} from 'utils/squaresUpdate';
import { processPGNToMove } from 'utils/pgn';
import availableSpecialMovesForSelectedPiece from 'utils/specialMoves';

function canDoSpecialMove(state, move, square) {
  if (!move.specialMove) return false;

  const specialMovesPieceCanDo = availableSpecialMovesForSelectedPiece({
    ...state,
    selectedSquareId: square.id
  });
  const containsTheMatchingMove = specialMovesPieceCanDo.some(
    (x) => x.type === move.specialMove.type
  );
  return containsTheMatchingMove;
}

function importSubReducer(cleanState, action) {
  const { fileText } = action;
  const data = importPGNFromFile(fileText);
  const processedMoves = data.pgnMoves.map(processPGNToMove);

  return processedMoves.reduce((p, move) => {
    const toIndex = p.squares.findIndex(
      (x) => x.file === move.to.file && x.rank === move.to.rank
    );
    const to = { ...p.squares[toIndex] };
    const toHasPiece = !!to && !!to.contains;
    const captured = toHasPiece ? { ...to.contains } : null;
    const func = toHasPiece ? isValidTake : isValidMove;

    const from = p.squares.find(
      (x) =>
        (!move.from ||
          (move.from &&
            x.file === move.from.file &&
            (!move.from.rank || x.rank === move.from.rank))) &&
        x.contains &&
        x.contains.colour === move.piece.colour &&
        x.contains.name === move.piece.name &&
        (func(x, to, p.squares) || canDoSpecialMove(p, move, x))
    );

    const movingPiece = mapPieceToMovedPiece(from.contains);
    let squares = mapPieceToNewSquare(p.squares, toIndex, {
      ...from,
      contains: movingPiece
    });

    const specialMove = move.specialMove
      ? { ...move.specialMove, squareId: to.id }
      : null;
    const isCastling =
      move.specialMove &&
      move.specialMove.type === Strings.specialMoves.castling;
    const isEnPassant =
      move.specialMove &&
      move.specialMove.type === Strings.specialMoves.enPassant;

    squares = !isCastling
      ? squares
      : performRookMovementForCastling(squares, to.id);

    const newState = {
      ...p,
      squares,
      graveyard: [...p.graveyard, captured].filter((x) => !!x),
      moves: [
        ...p.moves,
        mapSquaresToMove(from, squares[toIndex], squares, captured, specialMove)
      ],
      vsComputer: data.vsComputer
    };

    return !isEnPassant
      ? newState
      : updateBoardToRemovePassedPawn(newState, to.id);
  }, cleanState);
}

export default importSubReducer;
