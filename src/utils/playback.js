import { SLIDER_END } from 'constants/slider';

export const getMoveIndexForPlayback = (moves, playback) => {
  if (playback.sliderPosition === SLIDER_END) return moves.length;

  const percentage = playback.sliderPosition / SLIDER_END;
  const moveNumber = Math.round(moves.length * percentage);
  return moveNumber - 1;
};

export const selectNextMoveSquareId = (moves, moveIndex) => {
  const nextMove = { ...moves[moveIndex] };
  return nextMove.from.id;
};
