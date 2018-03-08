import Strings from 'constants/strings';

import {
  mapSquaresToMove,
  mapPieceToMovedPiece,
  mapPieceToNewSquare,
  mapPieceToNewPiece
} from 'utils/mappers';

function performMovementFromCurrentToTarget(state, specialMove) {
  const currentSquare = state.squares.find(
    x => x.id === state.selectedSquareId
  );
  const targetIndex = state.squares.findIndex(
    x => x.id === specialMove.squareId
  );
  const movingPiece = mapPieceToMovedPiece(currentSquare.contains);
  const defendingPiece = !!state.squares[targetIndex].contains
    ? { ...state.squares[targetIndex].contains }
    : null;

  const squares = mapPieceToNewSquare(state.squares, targetIndex, {
    ...currentSquare,
    contains: movingPiece
  });
  const moves = [
    ...state.moves,
    mapSquaresToMove(currentSquare, squares[targetIndex], specialMove)
  ];
  const graveyard = !!defendingPiece
    ? [...state.graveyard, defendingPiece]
    : state.graveyard;
  return {
    ...state,
    squares,
    selectedSquareId: null,
    moves,
    graveyard
  };
}

function specialMoveSubReducer(state, action) {
  const { type, squareId: targetSquareId } = action.specialMove;
  if (type === Strings.specialMoves.promotionSelection)
    return { ...state, promotionAt: action.specialMove };

  const postPieceMovementToTargetState = performMovementFromCurrentToTarget(
    state,
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

      return {
        ...postPieceMovementToTargetState,
        squares,
        graveyard: [...postPieceMovementToTargetState.graveyard, passedPiece]
      };
    }
    case Strings.specialMoves.castling: {
      console.log('%c special move: castling - not implemented', 'color: red');
      return state;
    }
    default:
      return state;
  }
}

export default specialMoveSubReducer;
