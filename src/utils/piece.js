import Constants from 'constants/index';

import { isValidTake } from './game';

const getPieceAttackPattern = piece => {
  const rook = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  const bishop = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  switch (piece) {
    case Constants.Strings.pieces.pawn:
      return [[1, -1], [1, 1], [-1, -1], [-1, 1]];
    case Constants.Strings.pieces.rook:
      return rook;
    case Constants.Strings.pieces.knight:
      return [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [-1, 2],
        [1, -2],
        [-1, -2]
      ];
    case Constants.Strings.pieces.bishop:
      return bishop;
    case Constants.Strings.pieces.queen:
      return [...bishop, ...rook];
    case Constants.Strings.pieces.king:
      return [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1]
      ];
    default:
      return null;
  }
};

export const discoverSquaresUnderThreat = squares =>
  squares.filter(x => x.contains).reduce((p, square) => {
    const fileIndex = Constants.files.findIndex(x => x === square.file);
    const piece = square.contains;
    const attacks = getPieceAttackPattern(piece.name)
      .map(move => {
        const toSquare = {
          rank: square.rank + move[0],
          file: Constants.files[fileIndex + move[1]]
        };
        if (!isValidTake(square, toSquare, squares)) return null;
        return {
          ...piece,
          square: toSquare
        };
      })
      .filter(x => !!x);

    return [...p, ...attacks];
  }, []);
