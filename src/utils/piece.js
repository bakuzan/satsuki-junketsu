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

export const getAttacksOnKingSquare = (kingSquare, squares) =>
  squares
    .filter(x => x.contains && x.contains.colour !== kingSquare.contains.colour)
    .reduce((p, square) => {
      if (!isValidTake(square, kingSquare, squares)) return p;
      return {
        square,
        kingSquare
      };
    }, []);

export const getCheckMoves = squares =>
  squares
    .filter(
      x => x.contains && x.contains.name === Constants.Strings.pieces.king
    )
    .reduce(
      (p, king) => ({
        ...p,
        [king.contains.colour]: getAttacksOnKingSquare(king, squares)
      }),
      {}
    );
