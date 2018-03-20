import Constants from 'constants/index';

import { mapPieceToNewSquare, mapPieceToNewPiece } from './mappers';
import { isValidMove, isValidTake } from './game';

export const willResultInCheck = (pieceSquare, squares) => {
  const colour = pieceSquare.contains.colour;
  const kingSquare = squares.find(matchKingForGivenColour(colour));
  return !!getAttacksOnKingSquare(kingSquare, squares).length;
};

export const possibleMovesForSelectedPiece = ({
  selectedSquareId,
  squares
}) => {
  if (!selectedSquareId) return [];
  const pieceSquare = squares.find(x => x.id === selectedSquareId);
  return squares.reduce((p, square, index) => {
    const func = square.contains ? isValidTake : isValidMove;
    return func(pieceSquare, square, squares) &&
      !willResultInCheck(
        pieceSquare,
        mapPieceToNewSquare(squares, index, pieceSquare)
      )
      ? [...p, square.id]
      : p;
  }, []);
};

const matchKingForGivenColour = colour => x =>
  x.contains &&
  x.contains.name === Constants.Strings.pieces.king &&
  x.contains.colour === colour;

const getAttacksOnKingSquare = (kingSquare, squares) =>
  squares
    .filter(x => x.contains && x.contains.colour !== kingSquare.contains.colour)
    .reduce((p, square) => {
      if (!isValidTake(square, kingSquare, squares)) return p;
      return [...p, square];
    }, []);

const colourHasPossibleMoves = (colour, squares) => {
  const piecesForColour = squares.filter(
    x => x.contains && x.contains.colour === colour
  );
  return piecesForColour.some(
    x =>
      !!possibleMovesForSelectedPiece({ selectedSquareId: x.id, squares })
        .length
  );
};

export const getCheckStatusForColour = (colour, squares) => {
  const kingSquare = squares.find(matchKingForGivenColour(colour));
  const attackers = getAttacksOnKingSquare(kingSquare, squares);
  const isCheckmate =
    !!attackers.length && !colourHasPossibleMoves(colour, squares);
  return {
    kingSquare,
    attackers,
    isCheckmate
  };
};

export const getCurrentCheckStatusAfterMove = (piece, squares) => {
  const colour =
    piece.colour === Constants.Strings.colours.white
      ? Constants.Strings.colours.black
      : Constants.Strings.colours.white;
  const { attackers, isCheckmate } = getCheckStatusForColour(colour, squares);
  return {
    isCheck: !!attackers.length,
    isCheckmate
  };
};

const CannotBeAmbiguous = [
  Constants.Strings.pieces.king,
  Constants.Strings.pieces.queen,
  Constants.Strings.pieces.bishop
];

export const checkForMoveAmbiguity = (
  oldSquare,
  targetSquare,
  squaresAfterMove,
  captured
) => {
  const movedPiece = targetSquare.contains;
  if (CannotBeAmbiguous.includes(movedPiece.name)) return false;

  const potentiallyAmbiguiousSquares = squaresAfterMove.filter(
    x =>
      x.id !== targetSquare.id &&
      x.contains &&
      x.contains.name === movedPiece.name &&
      x.contains.colour === movedPiece.colour
  );
  if (potentiallyAmbiguiousSquares.length === 0) return false;

  const fromIndex = squaresAfterMove.findIndex(x => x.id === oldSquare.id);
  const toIndex = squaresAfterMove.findIndex(x => x.id === targetSquare.id);
  let oldSquares = mapPieceToNewPiece(squaresAfterMove, fromIndex, {
    ...targetSquare.contains
  });
  oldSquares = mapPieceToNewPiece(oldSquares, toIndex, captured);

  const checkFunc = captured ? isValidTake : isValidMove;
  return potentiallyAmbiguiousSquares.some(x =>
    checkFunc(x, targetSquare, oldSquares)
  );
};
