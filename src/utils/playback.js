export const getMoveIndexForPlayback = (moves, playback) => {
  const percentage = playback / 100;
  const moveNumber = Math.round(moves.length * percentage);
  return moveNumber - 1;
};
