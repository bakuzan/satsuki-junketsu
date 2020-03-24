import { getKeyWithBestScore } from 'utils/common';
import { getCurrentPlayerColour } from 'utils/game';

import performMovementFromCurrentToTarget from 'utils/squaresUpdate';
import * as PossibleMoves from './possible-moves';
import { rateBoard } from './evaluate-board';

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

        return {
          currentColour,
          squareId,
          targetId,
          board: newBoard,
          score: rateBoard(currentColour, newBoard)
        };
      })
    ];
  }, []);

  return pieceMoves;
}

function mapOutcomeToNextOutcome(futures, isMaximising) {
  console.groupCollapsed('futures', futures.length);
  futures.map((x) => console.log(x, x.score));
  console.groupEnd();
  const thresholdFutures = futures.sort((a, b) =>
    isMaximising ? b.score - a.score : a.score - b.score
  );

  return thresholdFutures.slice(0, 5).reduce(
    (p, option) => [
      ...p,
      ...generatePossibilities(option.board).map((x) => ({
        ...option,
        currentColour: x.currentColour,
        board: x.board,
        score: x.score
      }))
    ],
    []
  );
}

const repeat = (n) => (f) => (x, b) => {
  let m = n;
  let c = b;

  while (true) {
    if (m === 0) {
      return x;
    } else {
      m = m - 1;
      x = f(x, c);
      c = !c;
    }
  }
};

function processPotentialFutures(board) {
  const depth = 4;
  const possibleOutcomes = generatePossibilities(board);
  const isMaximising = true;

  const nextMoveOptions = repeat(depth)(mapOutcomeToNextOutcome)(
    possibleOutcomes,
    isMaximising
  );

  const moveResults = nextMoveOptions.reduce((results, option) => {
    const key = `${option.squareId}-${option.targetId}`;
    return results.set(key, option.score);
  }, new Map([]));

  return moveResults;
}

function selectNextMove(board) {
  const t0 = performance.now();

  const outcomes = processPotentialFutures(board);
  const bestOutcome = getKeyWithBestScore(outcomes);

  if (!bestOutcome) {
    // TODO handle stalemate
    console.log('%c STALEMATE', 'color: orange; font-size: 16px;');
  }

  const [squareId, targetId] = bestOutcome.split('-');

  const engineMoveChoice = {
    moveType: 'standard',
    fromId: Number(squareId),
    toId: Number(targetId)
  };

  console.groupCollapsed('%c engine done', 'color: forestgreen');
  console.log('input > ', board);
  console.log('moves for pieces > ', outcomes);
  console.log('bestOutcome >> ', bestOutcome);
  console.log('output > ', engineMoveChoice);
  console.groupEnd();

  const t1 = performance.now();
  console.log(
    `Engine took ${t1 - t0} milliseconds to find best move: `,
    outcomes.get(bestOutcome),
    engineMoveChoice
  );

  return engineMoveChoice;
  /* TODO
   *
   * Account for special moves!
   * Scoring for Check(mate) (?)
   *
   */
}

// function selectNextMove(board) {
//   const { moves, squares } = board;
//   const currentColour = getCurrentPlayerColour(moves);
//   const pieceSquares = squares.filter(
//     (x) => x.contains && x.contains.colour === currentColour
//   );

//   const pieceMoves = pieceSquares.reduce((p, sq) => {
//     const squareId = sq.id;
//     const {
//       possibleMoves,
//       possibleSMoves
//     } = PossibleMoves.getPossibleMovesForPiece(board, squares, squareId);

//     const moveResults = possibleMoves.reduce((results, targetId) => {
//       const newMoveRating = rateBoard(
//         currentColour,
//         performMovementFromCurrentToTarget(board, squareId, targetId)
//       );

//       return results.set(targetId, newMoveRating);
//     }, new Map([]));

//     // TODO
//     // reduce, check moves, map to correct movement function,
//     // then mimic above to get ratings for the results.
//     const specialMoveResults = possibleSMoves.map((targetId) => targetId);

//     return [...p, { squareId, moveResults, specialMoveResults }];
//   }, []);

//   const bestPieceMove = pieceMoves.reduce(getMoveWithBestScore);
//   const bestTargetId = getKeyForMaxValue(bestPieceMove.moveResults);
//   const engineMoveChoice = {
//     moveType: 'standard',
//     fromId: bestPieceMove.squareId,
//     toId: bestTargetId
//   };

//   console.groupCollapsed('%c engine in progress', 'color: magenta');
//   console.log('input > ', board);
//   console.log('current player > ', currentColour);
//   console.log('pieces > ', pieceSquares);
//   console.log('moves for pieces > ', pieceMoves);
//   console.log('best >> ', bestPieceMove);
//   console.log('output > ', engineMoveChoice);
//   console.groupEnd();

//   return engineMoveChoice;
//   /* TODO
//    *
//    * Account for next player taking pieces!
//    * Account for special moves!
//    *
//    */
// }

export default {
  selectNextMove
};
