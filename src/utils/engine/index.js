import { getMoveWithBestScore, getKeyForMaxValue } from 'utils/common';
import { getCurrentPlayerColour } from 'utils/game';

import performMovementFromCurrentToTarget from 'utils/squaresUpdate';
import * as PossibleMoves from './possible-moves';
import evaluateBoard from './evaluate-board';

function selectNextMove(board) {
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

    const moveResults = possibleMoves.reduce(
      (results, targetId) =>
        results.set(
          targetId,
          evaluateBoard(
            currentColour,
            performMovementFromCurrentToTarget(board, squareId, targetId)
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
