import { SLIDER_START, SLIDER_END } from 'constants/slider';
import { buildStartingBoard } from './board';
import { mapPieceToMovedPiece, mapPieceToNewSquare } from './mappers';

export const resolveSliderValue = v =>
  v > SLIDER_END ? SLIDER_END : v < SLIDER_START ? SLIDER_START : v;

export const getMoveIndexForPlayback = (moves, playback) => {
  if (playback.sliderPosition === SLIDER_END) return moves.length;

  const percentage = playback.sliderPosition / SLIDER_END;
  const moveNumber = Math.round(moves.length * percentage);
  return moveNumber - 1;
};

export const selectNextMoveSquareId = (moves, moveIndex) => {
  const nextMove = moves[moveIndex];
  if (!nextMove) return null;
  return nextMove.from.id;
};

export const createBoardLayoutForMoveList = moves =>
  moves.reduce((squares, m) => {
    const from = squares.find(x => x.id === m.from.id);
    const toIndex = squares.findIndex(x => x.id === m.to.id);
    const contains = mapPieceToMovedPiece(from.contains);
    return mapPieceToNewSquare(squares, toIndex, {
      ...from,
      contains
    });
  }, buildStartingBoard());
