import Constants from 'constants/index';

import { isValidMove, isValidTake } from './game';

const matchKingForGivenColour = colour => x =>
  x.contains &&
  x.contains.name === Constants.Strings.pieces.king &&
  x.contains.colour === colour;

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

const getAttacksOnKingSquare = (kingSquare, squares) =>
  squares
    .filter(x => x.contains && x.contains.colour !== kingSquare.contains.colour)
    .reduce((p, square) => {
      if (!isValidTake(square, kingSquare, squares)) return p;
      return [...p, square];
    }, []);

export const getCheckMovesForColour = (colour, squares) => {
  const kingSquare = squares.find(matchKingForGivenColour(colour));
  return {
    kingSquare,
    attackers: getAttacksOnKingSquare(kingSquare, squares)
  };
};
