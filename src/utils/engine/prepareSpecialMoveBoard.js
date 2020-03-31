import Strings from 'constants/strings';

import { mapPieceToNewPiece } from 'utils/mappers';
import performMovementFromCurrentToTarget, {
  performRookMovementForCastling,
  updateBoardToRemovePassedPawn
} from 'utils/squaresUpdate';

export default function prepareSpecialMoveBoard(
  board,
  selectedSquareId,
  specialMove
) {
  const { type, squareId: targetSquareId } = specialMove;
  const postPieceMovementToTargetState = performMovementFromCurrentToTarget(
    board,
    selectedSquareId,
    targetSquareId,
    specialMove
  );

  switch (type) {
    case Strings.specialMoves.promotionSelection: {
      const promotionIndex = postPieceMovementToTargetState.squares.findIndex(
        (x) => x.id === targetSquareId
      );
      const squares = mapPieceToNewPiece(
        postPieceMovementToTargetState.squares,
        promotionIndex,
        {
          name: Strings.pieces.queen
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
      throw new Error('Unknown special move');
  }
}
