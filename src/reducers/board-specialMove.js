import Strings from 'constants/strings';

import { mapPieceToNewPiece } from 'utils/mappers';
import performMovementFromCurrentToTarget, {
  performRookMovementForCastling
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
      const movedToSquare = postPieceMovementToTargetState.squares.find(
        x => x.id === targetSquareId
      );
      const direction =
        movedToSquare.contains.colour === Strings.colours.white ? 1 : -1;
      const offsetRank = movedToSquare.rank - direction;
      const passedSquareIndex = postPieceMovementToTargetState.squares.findIndex(
        x => x.file === movedToSquare.file && x.rank === offsetRank
      );
      const passedPiece = {
        ...postPieceMovementToTargetState.squares[passedSquareIndex].contains
      };
      const squares = mapPieceToNewPiece(
        postPieceMovementToTargetState.squares,
        passedSquareIndex,
        null
      );
      const moveIndex = postPieceMovementToTargetState.moves.length - 1;
      const moves = [
        ...postPieceMovementToTargetState.moves.slice(0, moveIndex),
        {
          ...postPieceMovementToTargetState.moves[moveIndex],
          captured: { ...passedPiece }
        }
      ];

      return {
        ...postPieceMovementToTargetState,
        squares,
        moves,
        graveyard: [...postPieceMovementToTargetState.graveyard, passedPiece]
      };
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
