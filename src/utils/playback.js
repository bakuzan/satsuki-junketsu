import Strings from 'constants/strings';
import { SLIDER_START, SLIDER_END } from 'constants/slider';
import { buildStartingBoard } from './board';
import {
  mapPieceToMovedPiece,
  mapPieceToNewSquare,
  mapPieceToNewPiece
} from './mappers';
import {
  performRookMovementForCastling,
  updateSquaresToRemovePassedPawn
} from './squaresUpdate';

export const resolveSliderValue = v =>
  v > SLIDER_END ? SLIDER_END : v < SLIDER_START ? SLIDER_START : v;

export const getMoveIndexForPlayback = (moves, playback) => {
  if (playback.sliderPosition === SLIDER_END) return moves.length;
  if (playback.sliderPosition === SLIDER_START) return SLIDER_START;

  const percentage = playback.sliderPosition / SLIDER_END;
  const moveNumber = Math.round(moves.length * percentage);
  return moveNumber;
};

export const selectNextMoveSquareId = (moves, moveIndex) => {
  const nextMove = moves[moveIndex];
  if (!nextMove) return null;
  return nextMove.from.id;
};

const updateBoardUsingSpecialMove = (specialMove, squares) => {
  const { type, squareId: targetSquareId } = specialMove;
  switch (type) {
    case Strings.specialMoves.castling:
      return performRookMovementForCastling(squares, targetSquareId);
    case Strings.specialMoves.enPassant:
      return updateSquaresToRemovePassedPawn(squares, targetSquareId);
    case Strings.specialMoves.promotion: {
      const promotionIndex = squares.findIndex(x => x.id === targetSquareId);
      return mapPieceToNewPiece(squares, promotionIndex, {
        name: specialMove.promoteTo
      });
    }
    default:
      return squares;
  }
};

export const createBoardLayoutForMoveList = moves =>
  moves.reduce((squares, m) => {
    const from = squares.find(x => x.id === m.from.id);
    const toIndex = squares.findIndex(x => x.id === m.to.id);
    const contains = mapPieceToMovedPiece(from.contains);
    let newSquares = mapPieceToNewSquare(squares, toIndex, {
      ...from,
      contains
    });

    if (m.specialMove) {
      newSquares = updateBoardUsingSpecialMove(m.specialMove, newSquares);
    }

    return newSquares;
  }, buildStartingBoard());
