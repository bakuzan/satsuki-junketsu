import Strings from 'constants/strings';
import * as Regexes from 'constants/regex';

import { isWhitesTurn, isValidMove, isValidTake } from 'utils/game';
import { importPGNFromFile } from 'utils/exportImport';
import {
  mapPieceToMovedPiece,
  mapPieceToNewSquare,
  mapSquaresToMove
} from 'utils/mappers';
import {
  performRookMovementForCastling,
  updateBoardToRemovePassedPawn
} from 'utils/squaresUpdate';

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

  if (pgnStr.includes(Strings.pgn.promotion))
    return {
      type: Strings.specialMoves.promotion,
      promoteTo: getKeyForFirstLetter(
        pgnStr.replace(Regexes.MATCH_EVERYTHING_UPTO_EQUALS, '')
      )
    };

  if (pgnStr.includes(Strings.pgn.enPassant))
    return { type: Strings.specialMoves.enPassant };

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

  return processedMoves.reduce((p, move) => {
    const toIndex = p.squares.findIndex(
      x => x.file === move.to.file && x.rank === move.to.rank
    );
    const to = { ...p.squares[toIndex] };
    const toHasPiece = !!to && !!to.contains;
    const captured = toHasPiece ? { ...to.contains } : null;
    const func = toHasPiece ? isValidTake : isValidMove;

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
    const from = fromPossibilities[0];

    const movingPiece = mapPieceToMovedPiece(from.contains);
    let squares = mapPieceToNewSquare(p.squares, toIndex, {
      ...from,
      contains: movingPiece
    });

    const specialMove = move.specialMove
      ? { ...move.specialMove, squareId: to.id }
      : null;
    const isCastling =
      move.specialMove &&
      move.specialMove.type === Strings.specialMoves.castling;
    const isEnPassant =
      move.specialMove &&
      move.specialMove.type === Strings.specialMoves.enPassant;

    squares = !isCastling
      ? squares
      : performRookMovementForCastling(squares, to.id);

    const newState = {
      ...p,
      squares,
      graveyard: [...p.graveyard, captured].filter(x => !!x),
      moves: [
        ...p.moves,
        mapSquaresToMove(from, squares[toIndex], squares, captured, specialMove)
      ]
    };

    return !isEnPassant
      ? newState
      : updateBoardToRemovePassedPawn(newState, to.id);
  }, cleanState);
}

export default importSubReducer;
