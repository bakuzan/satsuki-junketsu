import * as pawns from './pawn';
import * as knights from './knight';
import * as bishops from './bishop';
import * as rooks from './rook';
import * as queens from './queen';
import * as kings from './king-middle';
import * as kingsLate from './king-late';

function getValueUsingWhiteTables(name, square) {}

function getValueUsingBlackTables(name, square) {}

export default function tableInteragator(square) {
  const { name, colour } = square.contains;

  if (colour === 'white') {
    return getValueUsingWhiteTables(name, square);
  } else {
    return getValueUsingBlackTables(name, square);
  }
}
