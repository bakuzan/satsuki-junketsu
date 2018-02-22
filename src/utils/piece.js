import Constants from 'constants/index';

import { mapPieceToNewSquare } from './mappers';
import { isValidMove, isValidTake } from './game';

const willResultInCheck = (pieceSquare, squares) => {
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

export const getcheckStatusForColour = (colour, squares) => {
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
