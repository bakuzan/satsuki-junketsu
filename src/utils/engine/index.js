import Strings from 'constants/strings';
import { getKeyWithBestScore } from 'utils/common';
import { getCurrentPlayerColour } from 'utils/game';

import performMovementFromCurrentToTarget from 'utils/squaresUpdate';
import prepareSpecialMoveBoard from './prepareSpecialMoveBoard';
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
    const {
      possibleMoves,
      possibleSMoves
    } = PossibleMoves.getPossibleMovesForPiece(board, squares, squareId);

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
          type: 'STANDARD',
          squareId,
          targetId,
          board: newBoard,
          score: rateBoard(currentColour, newBoard)
        };
      }),
      ...possibleSMoves.map((sMove) => {
        const newBoard = prepareSpecialMoveBoard(board, squareId, sMove);
        const type =
          sMove.type === Strings.specialMoves.promotionSelection
            ? Strings.specialMoves.promotion
            : sMove.type;

        return {
          currentColour,
          type,
          squareId,
          targetId: sMove.squareId,
          board: newBoard,
          score: rateBoard(currentColour, newBoard)
        };
      })
    ];
  }, []);

  return pieceMoves;
}

function mapOutcomeToNextOutcome(futures, isMaximising) {
  const thresholdFutures = futures.sort((a, b) =>
    isMaximising ? b.score - a.score : a.score - b.score
  );

  console.groupCollapsed('futures', futures.length);
  console.log('maxing ? ', isMaximising);
  console.log('min > ', Math.min(...futures.map((x) => x.score)));
  console.log('max > ', Math.max(...futures.map((x) => x.score)));
  console.log('futures > ', thresholdFutures);
  console.groupEnd();

  return thresholdFutures.slice(0, 6).reduce(
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
    return results.set(key, option);
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

  const option = outcomes.get(bestOutcome);
  const engineMoveChoice = {
    moveType: option.type,
    fromId: option.squareId,
    toId: option.targetId
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
}

export default {
  selectNextMove
};
