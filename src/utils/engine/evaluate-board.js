import Strings from 'constants/strings';
import pieceValues from 'constants/values';

import adjustGameDevelopment from './adjustGameDevelopment';
import calculatePieceDangerAndSecurity from './calculatePieceDangerAndSecurity';
import calculateSquareControl from './calculateSquareControl';

import { isValidDefend, isValidTake } from 'utils/game';
import { possibleMovesForSelectedPiece } from 'utils/piece';
import availableSpecialMovesForSelectedPiece from 'utils/specialMoves';

const { pieces: Pieces } = Strings;

const initPositionScoreValues = {
  gameDevelopment: 0,
  pieceDanger: 0,
  pieceSecurity: 0,
  pieceValue: 0,
  squareControl: 0
};

function incrementPieceValue(rating, piece) {
  rating.pieceValue += pieceValues.get(piece.name);
}

function createPlayerPositionScore(colourTurn, moveHistory, squares) {
  const rating = { ...initPositionScoreValues };
  const teamMateCount = squares.length;

  squares.forEach((square) => {
    const piece = square.contains;

    if (piece.name !== Pieces.king) {
      incrementPieceValue(rating, piece);
      calculatePieceDangerAndSecurity(rating, colourTurn, square);
      calculateSquareControl(rating, moveHistory, teamMateCount, square);
    }

    adjustGameDevelopment(rating, moveHistory, square); // includes castling
  });

  return rating;
}

function resolvePositionScore(rating) {
  return (
    rating.pieceValue * 1.25 +
    rating.pieceDanger +
    rating.squareControl / 20 +
    rating.pieceSecurity / 10 +
    rating.gameDevelopment / 5
  );
}

export function rateBoard(playingColour, board) {
  const { moves, squares } = board;

  const isWhite = playingColour === Strings.colours.white;
  const ap = squares.slice(0).filter((x) => x.contains);

  ap.forEach((sq) => {
    const { id, colour } = sq.contains;

    const moveSquares = possibleMovesForSelectedPiece({
      selectedSquareId: sq.id,
      squares
    }).map((id) => squares.find((s) => s.id === id));

    const spMoveSquares = availableSpecialMovesForSelectedPiece({
      selectedSquareId: sq.id,
      moves,
      squares
    }).map(({ squareId }) => squares.find((s) => s.id === squareId));

    sq.possibleMoves = [...moveSquares, ...spMoveSquares];
    sq.attackedBy = ap.filter(
      (x) =>
        x.contains.id !== id &&
        x.contains.colour !== colour &&
        isValidTake(x, sq, squares)
    );
    sq.defendedBy = ap.filter(
      (x) =>
        x.contains.id !== id &&
        x.contains.colour === colour &&
        isValidDefend(x, sq, squares)
    );
  });

  const wp = ap.filter((x) => x.contains.colour === Strings.colours.white);
  const bp = ap.filter((x) => x.contains.colour === Strings.colours.black);

  const whitePositionScore = createPlayerPositionScore(
    playingColour,
    moves,
    wp
  );

  const blackPositionScore = createPlayerPositionScore(
    playingColour,
    moves,
    bp
  );

  const whiteScore = resolvePositionScore(whitePositionScore);
  const blackScore = resolvePositionScore(blackPositionScore);
  // console.groupCollapsed('<squares>');
  // console.log('white > ', wp, whitePositionScore, whiteScore);
  // console.log('black > ', bp, blackPositionScore, blackScore);
  // console.groupEnd();
  return isWhite ? whiteScore - blackScore : blackScore - whiteScore;
}
