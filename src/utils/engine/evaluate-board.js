import Strings from 'constants/strings';

import getPieceSquareValue from './piece-sqaure-tables';
import * as PossibleMoves from './possible-moves';
import checkPawnHealth from './pawn-health';

const { pieces: Pieces } = Strings;

const getPieceCount = (arr, pieceName) =>
  arr.filter((x) => x.contains.name === pieceName).length;

const getScoreForPiece = (weight, pieceName) => (aSq, bSq) =>
  weight * (getPieceCount(aSq, pieceName) - getPieceCount(bSq, pieceName));

const scoreKings = getScoreForPiece(20000, Pieces.king);
const scoreQueens = getScoreForPiece(900, Pieces.queen);
const scoreRooks = getScoreForPiece(500, Pieces.rook);
const scoreBishops = getScoreForPiece(330, Pieces.bishop);
const scoreKnights = getScoreForPiece(320, Pieces.knight);
const scorePawns = getScoreForPiece(100, Pieces.pawn);

export default function evaluateBoard(playingColour, board) {
  const { squares } = board;

  const isWhite = playingColour === Strings.colours.white;
  const sign = isWhite ? 1 : -1;

  const wp = squares.filter(
    (x) => x.contains && x.contains.colour === Strings.colours.white
  );
  const bp = squares.filter(
    (x) => x.contains && x.contains.colour === Strings.colours.black
  );

  // KQRBNP counts
  const counts =
    scoreKings(wp, bp) +
    scoreQueens(wp, bp) +
    scoreRooks(wp, bp) +
    scoreBishops(wp, bp) +
    scoreKnights(wp, bp) +
    scorePawns(wp, bp);

  // Account for piece-square rating
  const pieceSquare = squares
    .filter((x) => x.contains)
    .reduce((v, sq) => v + getPieceSquareValue(sq), 0);

  // Doubled, Blocked, and Isolated pawns
  const pawnHealth = 50 * checkPawnHealth(squares);

  // Mobility
  const wpMoves = PossibleMoves.getAllUniquePossibleMoves(board, wp, isWhite);
  const bpMoves = PossibleMoves.getAllUniquePossibleMoves(board, bp, !isWhite);
  const mobility = 10 * (wpMoves.size - bpMoves.size);

  const score = (counts - pawnHealth + mobility) * sign + pieceSquare;
  console.groupCollapsed('score', score);
  console.log('couunts', counts);
  console.log('pieceSquare', pieceSquare);
  console.log('mobility', wpMoves, bpMoves, mobility);
  console.groupEnd();

  return score;
}
