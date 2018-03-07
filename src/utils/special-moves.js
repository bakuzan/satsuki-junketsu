import Constants from 'constants/index';

import {
  mapSquareIdToPromotion,
  mapSquareIdToEnPassant,
  mapSquareIdToCastling,
  mapPieceToNewSquare
} from './mappers';
import { possibleMovesForSelectedPiece, willResultInCheck } from './piece';

const { Strings } = Constants;

const BLACK_BACK_ROW = 8;
const BLACK_PAWN_ROW = 7;
const WHITE_PAWN_ROW = 2;
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

function checkPawnEnPassant(pawnSquare, boardState) {
  const { squares, moves } = boardState;
  const [lastMove] = moves.slice(-1);
  if (!lastMove) return [];
  if (lastMove.piece.name !== Strings.pieces.pawn) return [];

  const fromRank =
    lastMove.piece.colour === Strings.colours.white
      ? WHITE_PAWN_ROW
      : BLACK_PAWN_ROW;
  if (lastMove.from.rank !== fromRank || lastMove.to.rank !== pawnSquare.rank)
    return [];

  const toIndex = Constants.files.findIndex(x => x === lastMove.to.file);
  const pawnIndex = Constants.files.findIndex(x => x === pawnSquare.file);
  if (Math.abs(toIndex - pawnIndex) !== 1) return [];

  const direction =
    pawnSquare.contains.colour === Strings.colours.white ? -1 : 1;
  const targetSquare = squares.find(
    x => x.file === lastMove.to.file && x.rank === lastMove.to.rank - direction
  );
  return [mapSquareIdToEnPassant(targetSquare.id)];
}

function pawnSpecialMoves(pawnSquare, boardState) {
  return [
    ...checkPawnPromotion(pawnSquare, boardState.squares),
    ...checkPawnEnPassant(pawnSquare, boardState)
  ];
}

function kingSpecialMoves(kingSquare, squares) {
  if (kingSquare.contains.hasMoved) return [];
  if (willResultInCheck(kingSquare, squares)) return [];
  const rookSquares = squares.filter(
    x =>
      x.contains &&
      x.contains.name === Strings.pieces.rook &&
      x.contains.colour === kingSquare.contains.colour &&
      !x.contains.hasMoved
  );
  if (!rookSquares.length) return [];
  const kingId = kingSquare.id;
  const targetSquares = rookSquares.reduce((p, sq) => {
    const rookId = sq.id;
    const [startId, endId] =
      rookId < kingId ? [rookId, kingId] : [kingId, rookId];
    const squareIds = Array.from(
      new Array(endId - startId - 1),
      (x, i) => 1 + i + startId
    );
    if (!squares.filter(x => squareIds.includes(x.id)).every(x => !x.contains))
      return p;

    return squareIds.slice(0, 2).every(sqId => {
      const squareIndex = squares.findIndex(x => x.id === sqId);
      return !willResultInCheck(
        kingSquare,
        mapPieceToNewSquare(squares, squareIndex, kingSquare)
      );
    })
      ? [...p, squareIds[1]]
      : p;
  }, []);

  if (!targetSquares.length) return [];
  return targetSquares.map(mapSquareIdToCastling);
}

function availableSpecialMovesForSelectedPiece(boardState) {
  const { squares, selectedSquareId } = boardState;
  const square = squares.find(x => x.id === selectedSquareId);
  if (!square) return [];

  switch (square.contains.name) {
    case Strings.pieces.pawn:
      return pawnSpecialMoves(square, boardState);
    case Strings.pieces.king:
      return kingSpecialMoves(square, squares);
    default:
      return [];
  }
}

export default availableSpecialMovesForSelectedPiece;
