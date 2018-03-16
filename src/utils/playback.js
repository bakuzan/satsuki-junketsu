import { SLIDER_END } from 'constants/slider';
import { buildStartingBoard } from './board';
import { mapPieceToMovedPiece, mapPieceToNewSquare } from './mappers';

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
