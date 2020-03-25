import { pieces } from './strings';

export default new Map([
  [pieces.pawn, 10],
  [pieces.rook, 50],
  [pieces.knight, 30],
  [pieces.bishop, 30],
  [pieces.queen, 90],
  [pieces.king, 0] // captured king is game over duh
]);
