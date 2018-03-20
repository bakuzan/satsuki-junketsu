import Strings from 'constants/strings';
import * as Regexes from 'constants/regex';

import { isWhitesTurn, isValidMove, isValidTake } from 'utils/game';
import { importPGNFromFile } from 'utils/exportImport';
import {
  mapPieceToMovedPiece,
  mapPieceToNewSquare,
  mapSquaresToMove
} from 'utils/mappers';

const getKeyForFirstLetter = l => {
  const keys = Object.keys(Strings.pgn.piece);
  return keys.find(x => Strings.pgn.piece[x] === l) || Strings.pieces.pawn;
};

const isKingSideCastle = s => s.length === 3;
const resolveCastlingFromSquare = (pgnStr, isWhiteMove) => ({
  file: 'e',
  rank: isWhiteMove ? 1 : 8
});
function resolveCastlingToSquare(pgnStr, isWhiteMove) {
  const rank = isWhiteMove ? 1 : 8;
  return isKingSideCastle(pgnStr) ? { file: 'g', rank } : { file: 'c', rank };
}

function resolveSpecialMove(pgnStr) {
  if (pgnStr === Strings.pgn.castle.king || pgnStr === Strings.pgn.castle.queen)
    return { type: Strings.specialMoves.castling };
  if (pgnStr.includes('='))
    return {
      type: Strings.specialMoves.promotion,
      promoteTo: getKeyForFirstLetter(
        pgnStr.replace(Regexes.MATCH_EVERYTHING_UPTO_EQUALS, '')
      )
    };
  return null;
}

function resolveFromSquare(pgnStr) {
  const result = Regexes.MATCH_PGN_WITH_ADDITIONAL_FILE.exec(pgnStr);
  if (!result) return null;
  return { file: result[0].slice(0, 1) };
}

function processPGNToMove(pgnStr, index) {
  const isWhiteMove = isWhitesTurn(index);
  const colour = isWhiteMove ? Strings.colours.white : Strings.colours.black;
  const capturedColour = !isWhiteMove
    ? Strings.colours.white
    : Strings.colours.black;

  const specialMove = resolveSpecialMove(pgnStr);
  const isCastling =
    specialMove && specialMove.type === Strings.specialMoves.castling;

  const name = getKeyForFirstLetter(pgnStr.slice(0, 1));
  const piece = isCastling
    ? { colour, name: Strings.pieces.king, hasMoved: true }
    : { colour, name, hasMoved: true };

  const [file, rank] = pgnStr
    .replace(Regexes.MATCH_EVERYTHING_BEFORE_FILE_RANK_PAIR, '')
    .split('');
  const to = !isCastling
    ? { file, rank: Number(rank) }
    : resolveCastlingToSquare(pgnStr, isWhiteMove);

  const from = isCastling
    ? resolveCastlingFromSquare(pgnStr, isWhiteMove)
    : resolveFromSquare(pgnStr);
  const captured = pgnStr.includes('x') ? { colour: capturedColour } : null;
  console.log(pgnStr, from, piece, to);
  return {
    from,
    piece,
    to,
    isAmbiguous: !isCastling && !!from,
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
  const processedState = processedMoves.reduce((p, move) => {
    const toIndex = p.squares.findIndex(
      x => x.file === move.to.file && x.rank === move.to.rank
    );
    const to = { ...p.squares[toIndex] };
    const toHasPiece = !!to && !!to.contains;
    const captured = toHasPiece ? { ...to.contains } : null;
    const func = toHasPiece ? isValidTake : isValidMove;
    // TODO Need a distinguishing "from file/rank"
    // added during pgn creation
    console.groupCollapsed('process move > ');
    console.log('latest', p);
    console.log('move > ', move);
    console.log('to > ', to);
    console.log('toHasPiece > ', toHasPiece);
    console.log('captured > ', captured);
    console.log('moving piece > ', move.piece);
    console.log('from ? > ', move.from);

    const fromPossibilities = p.squares.filter(
      x =>
        (!move.from ||
          (move.from &&
            x.file === move.from.file &&
            (!move.from.rank || x.rank === move.from.rank))) &&
        x.contains &&
        x.contains.colour === move.piece.colour &&
        x.contains.name === move.piece.name &&
        (func(x, to, p.squares) || !!move.specialMove)
    );
    console.log('possibilities ?? > ', fromPossibilities);
    const from = fromPossibilities[0];
    console.groupEnd();
    const movingPiece = mapPieceToMovedPiece(from.contains);
    let squares = mapPieceToNewSquare(p.squares, toIndex, {
      ...from,
      contains: movingPiece
    });
    const isCastling =
      move.specialMove &&
      move.specialMove.type === Strings.specialMoves.castling;
    squares = !isCastling ? squares : tempCastlingFunction(squares, to.id);

    const specialMove = move.specialMove
      ? { ...move.specialMove, squareId: to.id }
      : null;

    return {
      ...p,
      squares,
      graveyard: [...p.graveyard, captured].filter(x => !!x),
      moves: [
        ...p.moves,
        mapSquaresToMove(from, squares[toIndex], squares, captured, specialMove)
      ]
    };
  }, cleanState);
  console.log('loaded state > ', processedState);
  return processedState;
}

export default importSubReducer;

const Castling = {
  kingTargets: ['c', 'g'],
  rookStarts: ['a', 'h'],
  rookEnds: ['d', 'f']
};
function tempCastlingFunction(squares, kingSquareId) {
  const newKingSquare = squares.find(x => x.id === kingSquareId);
  const rookFileIndex = Castling.kingTargets.findIndex(
    x => x === newKingSquare.file
  );
  const rookSquare = squares.find(
    x =>
      x.rank === newKingSquare.rank &&
      x.file === Castling.rookStarts[rookFileIndex]
  );
  const rookTargetIndex = squares.findIndex(
    x =>
      x.rank === newKingSquare.rank &&
      x.file === Castling.rookEnds[rookFileIndex]
  );
  const movingRook = mapPieceToMovedPiece(rookSquare.contains);
  const postCastleSquares = mapPieceToNewSquare(squares, rookTargetIndex, {
    ...rookSquare,
    contains: movingRook
  });

  return postCastleSquares;
}
