import Constants from 'constants/index';

const { pieces, colours } = Constants.Strings;

const getStartingPiece = (rank, file) => {
  if ([1, 2, 7, 8].indexOf(rank) === -1) return null;

  const piece = {
    colour: rank < 5 ? colours.white : colours.black,
    hasMoved: false
  };
  if ([2, 7].indexOf(rank) > -1) return { ...piece, name: pieces.pawn };
  if (['a', 'h'].indexOf(file) > -1) return { ...piece, name: pieces.rook };
  if (['b', 'g'].indexOf(file) > -1) return { ...piece, name: pieces.knight };
  if (['c', 'f'].indexOf(file) > -1) return { ...piece, name: pieces.bishop };
  return { ...piece, name: file === 'd' ? pieces.queen : pieces.king };
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
