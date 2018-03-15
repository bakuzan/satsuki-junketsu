const SLIDER_END = 100;

export const getMoveIndexForPlayback = (moves, playback) => {
  if (playback.sliderPosition === SLIDER_END) return moves.length;

  const percentage = playback.sliderPosition / SLIDER_END;
  const moveNumber = Math.round(moves.length * percentage);
  return moveNumber - 1;
};
