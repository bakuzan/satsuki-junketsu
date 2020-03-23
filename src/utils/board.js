import Constants from 'constants/index';

const { pieces, colours } = Constants.Strings;

const getStartingPiece = (rank, file) => {
  if ([1, 2, 7, 8].indexOf(rank) === -1) return null;

  let piece = '',
    pieceId = '';
  const colour = rank < 5 ? colours.white : colours.black;

  if ([2, 7].indexOf(rank) > -1) {
    [piece, pieceId] = [pieces.pawn, 'p'];
  } else if (['a', 'h'].indexOf(file) > -1) {
    [piece, pieceId] = [pieces.rook, 'r'];
  } else if (['b', 'g'].indexOf(file) > -1) {
    [piece, pieceId] = [pieces.knight, 'n'];
  } else if (['c', 'f'].indexOf(file) > -1) {
    [piece, pieceId] = [pieces.bishop, 'b'];
  } else {
    [piece, pieceId] = file === 'd' ? [pieces.queen, 'q'] : [pieces.king, 'k'];
  }

  return {
    id: `${colour.slice(0, 1)}-${pieceId}-${file}`,
    name: piece,
    colour,
    hasMoved: false,
    ...(piece === pieces.king ? { hasCastled: false } : {})
  };
};

export const buildStartingBoard = () => {
  let letters = Constants.files.slice(0);
  let lastIndex = -1;

  return Array(64)
    .fill(null)
    .map((item, index) => {
      const number = 8 - Math.floor(index / 8);
      const letterIndex = (index + number) % 8;
      if (letterIndex === lastIndex) {
        letters.push(letters.shift());
        lastIndex = -1;
      }

      const letter = letters[letterIndex];
      lastIndex = letterIndex;
      return {
        id: index,
        rank: number,
        file: letter,
        contains: getStartingPiece(number, letter)
      };
    });
};

export const isSameSquare = (s1, s2) =>
  s1.rank === s2.rank && s1.file === s2.file;

export const isBetween = (num1, num2, middleNumber) => {
  if (num1 < middleNumber && middleNumber < num2) return true;
  if (num1 > middleNumber && middleNumber > num2) return true;
  return false;
};

export const isOnDiagonal = (fileIndex, from, to, square) => {
  const fromFileIndex = Constants.files.findIndex((x) => x === from.file);
  const fileDiff = Math.abs(fileIndex - fromFileIndex);
  const rankDiff = Math.abs(square.rank - from.rank);
  if (!(fileDiff === rankDiff)) return false;
  if (!isBetween(from.rank, to.rank, square.rank)) return false;

  const toFileIndex = Constants.files.findIndex((x) => x === to.file);
  if (!isBetween(fromFileIndex, toFileIndex, fileIndex)) return false;
  return true;
};
