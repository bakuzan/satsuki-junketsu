import { pieces } from './strings';

export default new Map([
  [pieces.pawn, 1],
  [pieces.rook, 5],
  [pieces.knight, 3],
  [pieces.bishop, 3],
  [pieces.queen, 9],
  [pieces.king, 0] // captured king is game over duh
]);
