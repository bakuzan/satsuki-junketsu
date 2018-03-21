import Strings from 'constants/strings';

import { mapPieceToNewPiece } from 'utils/mappers';
import performMovementFromCurrentToTarget, {
  performRookMovementForCastling,
  updateBoardToRemovePassedPawn
} from 'utils/squaresUpdate';

function specialMoveSubReducer(state, action) {
  const { type, squareId: targetSquareId } = action.specialMove;
  if (type === Strings.specialMoves.promotionSelection)
    return { ...state, promotionAt: action.specialMove };

  const postPieceMovementToTargetState = performMovementFromCurrentToTarget(
    state,
    state.selectedSquareId,
    action.specialMove.squareId,
    action.specialMove
  );
  switch (type) {
    case Strings.specialMoves.promotion: {
      const promotionIndex = postPieceMovementToTargetState.squares.findIndex(
        x => x.id === targetSquareId
      );
      const squares = mapPieceToNewPiece(
        postPieceMovementToTargetState.squares,
        promotionIndex,
        {
          name: action.specialMove.promoteTo
        }
      );

      return {
        ...postPieceMovementToTargetState,
        squares,
        promotionAt: null
      };
    }
    case Strings.specialMoves.enPassant: {
      return updateBoardToRemovePassedPawn(
        postPieceMovementToTargetState,
        targetSquareId
      );
    }
    case Strings.specialMoves.castling: {
      const squares = performRookMovementForCastling(
        postPieceMovementToTargetState.squares,
        targetSquareId
      );
      return {
        ...postPieceMovementToTargetState,
        squares
      };
    }
    default:
      return state;
  }
}

export default specialMoveSubReducer;
