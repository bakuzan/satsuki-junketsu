import Strings from 'constants/strings';

import { isWhitesTurn, isValidMove, isValidTake } from 'utils/game';
import { importPGNFromFile } from 'utils/exportImport';

const getKeyForFirstLetter = l => {
  const keys = Object.keys(Strings.pgn.piece);
  return keys.find(x => Strings.pgn.piece[x] === l) || Strings.pieces.pawn;
};

function resolveSpecialMove(pgnStr) {
  if (pgnStr === Strings.pgn.castle.king || pgnStr === Strings.pgn.castle.queen)
    return { type: Strings.specialMoves.castling };
  if (pgnStr.includes('='))
    return {
      type: Strings.specialMoves.promotion,
      promoteTo: getKeyForFirstLetter(pgnStr.replace(/.*=/, ''))
    };
  return null;
}

function processPGNToMove(pgnStr, index) {
  const isWhiteMove = isWhitesTurn(index);
  const colour = isWhiteMove ? Strings.colours.white : Strings.colours.black;
  const capturedColour = !isWhiteMove
    ? Strings.colours.white
    : Strings.colours.black;
  const name = getKeyForFirstLetter(pgnStr.slice(0, 1));
  const piece = { colour, name, hasMoved: true };

  const [file, rank] = pgnStr.replace(/.*(?=[a-h]\d)/g, '').split('');
  const to = { file, rank };

  const from = {};
  const captured = pgnStr.includes('x') ? { colour: capturedColour } : null;
  const specialMove = resolveSpecialMove(pgnStr);

  return {
    from,
    piece,
    to,
    specialMove,
    captured,
    checkStatus: {
      isCheck: pgnStr.includes('+'),
      isCheckmate: pgnStr.includes('#')
    }
  };
}

function importSubReducer(cleanState, action) {
  const { fileText } = action;
  const data = importPGNFromFile(fileText);
  const processedMoves = data.pgnMoves.map(processPGNToMove);
  console.log('processed > ', processedMoves);

  const processedState = processedMoves.reduce((p, move) => {
    const to = p.squares.find(
      x => x.file === move.to.file && x.rank === move.to.rank
    );
    const captured = to.contains ? { ...to.contains } : null;
    const func = to.contains ? isValidTake : isValidMove;
    const from = p.squares.find(
      x =>
        x.contains &&
        x.contains.colour === move.piece.colour &&
        x.contains.name === move.piece.name &&
        func(x, to, p.squares)
    );
    const squares = p.squares; // TODO updated squares with things above.
    const specialMove = move.specialMove
      ? { ...move.specialMove, squareId: to.id }
      : null;

    return {
      ...p,
      squares,
      moves: [
        ...p.moves,
        mapSquaresToMove(from, to, squares, captured, specialMove)
      ]
    };
  }, cleanState);
  console.log('loaded state > ', processedState);
  return cleanState;
}

export default importSubReducer;
