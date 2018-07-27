import Strings from 'constants/strings';

import * as pawns from './pawn';
import * as knights from './knight';
import * as bishops from './bishop';
import * as rooks from './rook';
import * as queens from './queen';
import * as kings from './king-middle';

const { pieces } = Strings;

function getTable(name) {
  switch (name) {
    case pieces.pawn:
      return pawns;
    case pieces.knight:
      return knights;
    case pieces.bishop:
      return bishops;
    case pieces.rook:
      return rooks;
    case pieces.queen:
      return queens;
    case pieces.king:
      return kings;
    default:
      return {};
  }
}

export default function tableInteragator(square) {
  const { id, contains } = square;
  const { name, colour } = contains;

  const table = getTable(name, id);
  return table[colour][id];
}
