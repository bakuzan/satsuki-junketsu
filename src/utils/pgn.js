import Strings from 'constants/strings';
import { generateUniqueId } from 'utils/common';

const KING_SIDE_CASTLE = 'g';

function generatePortableGameNotationForMove(item) {
  console.log(item);
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
  // if (item.check.inCheck && !item.check.winner) pgn += Strings.pgn.check;
  // if (item.check.inCheck && item.check.winner) pgn += Strings.pgn.checkmate;
  return {
    id,
    pgn
  };
}

export const mapMovesToPGN = arr =>
  arr.map(generatePortableGameNotationForMove);
