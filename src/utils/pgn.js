import Strings from 'constants/strings';
import * as Regexes from 'constants/regex';

import { isWhitesTurn } from 'utils/game';
import { generateUniqueId } from 'utils/common';

const KING_SIDE_CASTLE = 'g';

function generatePortableGameNotationForMove(item) {
  const id = generateUniqueId();
  let pgn = '';
  if (
    item.specialMove &&
    item.specialMove.type === Strings.specialMoves.castling
  ) {
    const isKingSide = item.to.file === KING_SIDE_CASTLE;
    return {
      id,
      pgn: isKingSide ? Strings.pgn.castle.king : Strings.pgn.castle.queen
    };
  }
  pgn += Strings.pgn.piece[item.piece.name];
  if (item.isAmbiguous) pgn += `${item.from.file}`;
  if (item.captured) pgn += `${Strings.pgn.capture}`;
  pgn += `${item.to.file}${item.to.rank}`;
  if (
    item.specialMove &&
    item.specialMove.type === Strings.specialMoves.promotion
  ) {
    pgn += `${Strings.pgn.promotion}${Strings.pgn.piece[
      item.specialMove.promoteTo
    ] || ''}`;
  }
  if (
    item.specialMove &&
    item.specialMove.type === Strings.specialMoves.enPassant
  ) {
    pgn += `${Strings.pgn.enPassant}`;
  }
  const { isCheck, isCheckmate } = item.checkStatus;
  if (!isCheckmate && isCheck) pgn += Strings.pgn.check;
  if (isCheckmate) pgn += Strings.pgn.checkmate;
  return {
    id,
    pgn
  };
}

export const mapMovesToPGN = arr =>
  arr.map(generatePortableGameNotationForMove);

/* Above, generating pgn from board state
 * Below, importing pgn, using it to create moves.
 */

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

export function processPGNToMove(pgnStr, index) {
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
