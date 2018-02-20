import Constants from 'constants/index';

import { isValidMove, isValidTake } from './game';

export const possibleMovesForSelectedPiece = ({
  selectedSquareId,
  squares
}) => {
  if (!selectedSquareId) return [];
  const pieceSquare = squares.find(x => x.id === selectedSquareId);
  return squares.reduce((p, square) => {
    const func = square.contains ? isValidTake : isValidMove;
    return func(pieceSquare, square, squares) ? [...p, square.id] : p;
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
    x => !!possibleMovesForSelectedPiece(x.id, squares).length
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
