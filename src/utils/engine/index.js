import { getKeyWithBestScore, getObjWithBestScore } from 'utils/common';
import { getCurrentPlayerColour } from 'utils/game';

import performMovementFromCurrentToTarget from 'utils/squaresUpdate';
import * as PossibleMoves from './possible-moves';
import evaluateBoard from './evaluate-board';

function generatePossibilities(board) {
  const { moves, squares } = board;
  const currentColour = getCurrentPlayerColour(moves);
  const pieceSquares = squares.filter(
    (x) => x.contains && x.contains.colour === currentColour
  );

  const pieceMoves = pieceSquares.reduce((p, sq) => {
    const squareId = sq.id;
    const { possibleMoves } = PossibleMoves.getPossibleMovesForPiece(
      board,
      squares,
      squareId
    );

    return [
      ...p,
      ...possibleMoves.map((targetId) => {
        const newBoard = performMovementFromCurrentToTarget(
          board,
          squareId,
          targetId
        );
        const score = evaluateBoard(currentColour, newBoard);

        return {
          squareId,
          targetId,
          board: newBoard,
          score
        };
      })
    ];
  }, []);

  // console.groupCollapsed('%c engine in progress', 'color: magenta');
  // console.log('input > ', board);
  // console.log('current player > ', currentColour);
  // console.log('pieces > ', pieceSquares);
  // console.log('moves for pieces > ', pieceMoves);
  // console.groupEnd();

  return pieceMoves;
}

const mapOutcomeToNextOutcome = (option) => {
  const { score, board } = generatePossibilities(option.board).reduce(
    getObjWithBestScore
  );

  return {
    ...option,
    board,
    score
  };
};

function processPotentialFutures(board) {
  const possibleOutcomes = generatePossibilities(board);
  const opponentOutcomes = possibleOutcomes.map(mapOutcomeToNextOutcome);
  const nextMoveOptions = opponentOutcomes.map(mapOutcomeToNextOutcome);

  const moveResults = nextMoveOptions.reduce((results, option) => {
    const key = `${option.squareId}-${option.targetId}`;
    return results.set(key, option.score);
  }, new Map([]));

  return moveResults;
}

function selectNextMove(board) {
  const outcomes = processPotentialFutures(board);

  const bestOutcome = getKeyWithBestScore(outcomes);
  const [squareId, targetId] = bestOutcome.split('-');

  const engineMoveChoice = {
    fromId: Number(squareId),
    toId: Number(targetId)
  };

  console.groupCollapsed('%c engine done', 'color: forestgreen');
  console.log('input > ', board);
  console.log('moves for pieces > ', outcomes);
  console.log('bestOutcome >> ', bestOutcome);
  console.log('output > ', engineMoveChoice);
  console.groupEnd();

  return engineMoveChoice;
  /* TODO
   *
   * Account for special moves!
   * Scoring for Check(mate) (?)
   * 
   */
}

export default {
  selectNextMove
};
