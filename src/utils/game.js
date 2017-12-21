import Constants from 'constants/index';

import { isSameSquare, isOnDiagonal, isBetween } from './board';

export const isWhitesTurn = moveCount => moveCount === 0 || moveCount % 2 === 0;

export const getCurrentPlayerColour = moves =>
  isWhitesTurn(moves.length)
    ? Constants.Strings.colours.white
    : Constants.Strings.colours.black;

const hasFreePath = (from, to, match, squares) => {
  const hasDiagonalMovement = !(match.files || match.ranks);
  for (let i = 0, length = squares.length; i < length; i++) {
    const square = squares[i];
    if (square.contains === null) continue;
    if (isSameSquare(from, square)) continue;

    const fileIndex = Constants.files.findIndex(x => x === square.file);
    if (hasDiagonalMovement) {
      if (isOnDiagonal(fileIndex, from, to, square)) return false;
    } else if (match.files && square.file === to.file) {
      if (isBetween(from.rank, to.rank, square.rank)) return false;
    } else if (match.ranks && square.rank === to.rank) {
      const fromFileIndex = Constants.files.findIndex(x => x === from.file);
      const toFileIndex = Constants.files.findIndex(x => x === to.file);
      if (isBetween(fromFileIndex, toFileIndex, fileIndex)) return false;
    }
  }
  return true;
};
export const isValidMove = (from, to, squares) => {
  const { contains: piece } = from;
  const match = {
    files: from.file === to.file,
    ranks: from.rank === to.rank
  };
  const fromFileIndex = Constants.files.findIndex(x => x === from.file);
  const toFileIndex = Constants.files.findIndex(x => x === to.file);
  const fileDiff = Math.abs(toFileIndex - fromFileIndex);
  const rankDiff = Math.abs(to.rank - from.rank);

  switch (piece.name) {
    case Constants.Strings.pieces.pawn:
      if (!match.files) return false;
      if (piece.colour === Constants.Strings.colours.white) {
        if (from.rank === 2 && [3, 4].indexOf(to.rank) !== -1) return true;
        if (rankDiff === 1 && from.rank < to.rank) return true;
      } else if (piece.colour === Constants.Strings.colours.black) {
        if (from.rank === 7 && [6, 5].indexOf(to.rank) !== -1) return true;
        if (rankDiff === 1 && from.rank > to.rank) return true;
      }
      return false;
    case Constants.Strings.pieces.rook:
      if (match.files || match.ranks)
        return hasFreePath(from, to, match, squares);
      return false;
    case Constants.Strings.pieces.knight:
      if (match.files || match.ranks) return false;
      if (rankDiff === 1 && fileDiff === 2) return true;
      if (rankDiff === 2 && fileDiff === 1) return true;
      return false;
    case Constants.Strings.pieces.bishop:
      if (fileDiff === rankDiff) return hasFreePath(from, to, match, squares);
      return false;
    case Constants.Strings.pieces.queen:
      if (match.files || match.ranks)
        return hasFreePath(from, to, match, squares);
      if (fileDiff === rankDiff) return hasFreePath(from, to, match, squares);
      return false;
    case Constants.Strings.pieces.king:
      if (match.ranks && fileDiff === 1) return true;
      if (match.files && rankDiff === 1) return true;
      if (rankDiff === 1 && fileDiff === 1) return true;
      return false;
    default:
      return false;
  }
};

export const isValidTake = (from, to, squares) => {
  const { contains: attacker } = from;
  const toSquare = squares.find(x => x.file === to.file && x.rank === to.rank);
  if (!toSquare || !toSquare.contains) return false;
  if (toSquare.contains.colour === attacker.colour) return false;

  switch (attacker.name) {
    case Constants.Strings.pieces.pawn:
      const fromIndex = Constants.files.findIndex(x => x === from.file);
      const toIndex = Constants.files.findIndex(x => x === to.file);
      if (
        Math.abs(toIndex - fromIndex) === 1 &&
        Math.abs(to.rank - from.rank) === 1
      )
        return true;
      return false;
    case Constants.Strings.pieces.rook:
    case Constants.Strings.pieces.knight:
    case Constants.Strings.pieces.bishop:
    case Constants.Strings.pieces.queen:
    case Constants.Strings.pieces.king:
      return isValidMove(from, to, squares);
    default:
      return false;
  }
};
