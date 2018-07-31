import Strings from 'constants/strings';
import { getMoveWithBestScore, getKeyForMaxValue } from 'utils/common';
import { getCurrentPlayerColour } from 'utils/game';
import { possibleMovesForSelectedPiece } from 'utils/piece';
import availableSpecialMovesForSelectedPiece from 'utils/specialMoves';

import performMovementFromCurrentToTarget from 'utils/squaresUpdate';
import getPieceSquareValue from './piece-sqaure-tables';

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

function getPossibleMovesForPiece(board, squares, squareId) {
  const fakeBoardState = {
    ...board,
    selectedSquareId: squareId,
    squares
  };
  return {
    possibleMoves: possibleMovesForSelectedPiece(fakeBoardState),
    possibleSMoves: availableSpecialMovesForSelectedPiece(fakeBoardState)
  };
}

function getAllUniquePossibleMoves(board, pSquares, isEngine = false) {
  const { moves, squares } = board;
  const fakeMoves = isEngine ? moves.slice(1) : moves;
  const fakeBoard = {
    ...board,
    moves: fakeMoves
  };
  const ids = pSquares.reduce((acc, sq) => {
    const { possibleMoves, possibleSMoves } = getPossibleMovesForPiece(
      fakeBoard,
      squares,
      sq.id
    );
    return [...acc, ...possibleMoves, ...possibleSMoves];
  }, []);

  return new Set(ids);
}

function evaluateBoard(playingAsColour) {
  return (board, targetId) => {
    const { squares } = board;
    const squareMovedTo = squares.find((x) => x.id === targetId);
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
    const pieceSquare = getPieceSquareValue(squareMovedTo);

    // Doubled, Blocked, and Isolated pawns
    // score -= 50 * (D-D + B-B + I-I);

    // Mobility
    const wpMoves = getAllUniquePossibleMoves(board, wp, true);
    const bpMoves = getAllUniquePossibleMoves(board, bp);
    const mobility = 10 * (wpMoves.size - bpMoves.size);

    const score = counts + pieceSquare + mobility;
    console.groupCollapsed('score', score);
    console.log('couunts', counts);
    console.log('pieceSquare', pieceSquare);
    console.log('mobility', mobility);
    console.groupEnd();
    return score;
  };
}

function selectNextMove(board) {
  const { moves, squares } = board;
  const currentColour = getCurrentPlayerColour(moves);
  const getBoardScore = evaluateBoard(currentColour);
  const pieceSquares = squares.filter(
    (x) => x.contains && x.contains.colour === currentColour
  );

  const pieceMoves = pieceSquares.reduce((p, sq) => {
    const squareId = sq.id;
    const { possibleMoves, possibleSMoves } = getPossibleMovesForPiece(
      board,
      squares,
      squareId
    );

    const moveResults = possibleMoves.reduce(
      (results, targetId) =>
        results.set(
          targetId,
          getBoardScore(
            performMovementFromCurrentToTarget(board, squareId, targetId),
            targetId
          )
        ),
      new Map([])
    );

    // TODO will require refactor of board-specialMove reducer
    const specialMoveResults = possibleSMoves.map((targetId) => targetId);

    return [...p, { squareId, moveResults, specialMoveResults }];
  }, []);

  const bestPieceMove = pieceMoves.reduce((bestMove, curr) =>
    getMoveWithBestScore(bestMove, curr)
  );
  const bestTargetId = getKeyForMaxValue(bestPieceMove.moveResults);
  const engineMoveChoice = {
    fromId: bestPieceMove.squareId,
    toId: bestTargetId
  };

  console.groupCollapsed('%c engine in progress', 'color: magenta');
  console.log('input > ', board);
  console.log('current player > ', currentColour);
  console.log('pieces > ', pieceSquares);
  console.log('moves for pieces > ', pieceMoves);
  console.log('best >> ', bestPieceMove);
  console.log('output > ', engineMoveChoice);
  console.groupEnd();

  return engineMoveChoice;
  /* TODO
   *
   * Account for next player taking pieces!
   * Account for special moves!
   * 
   */
}

export default {
  selectNextMove
};
