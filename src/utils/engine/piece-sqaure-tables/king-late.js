import { splitMirrorAndJoin } from 'utils/common';

const base = [
  -50,
  -40,
  -30,
  -20,
  -20,
  -30,
  -40,
  -50,
  -30,
  -20,
  -10,
  0,
  0,
  -10,
  -20,
  -30,
  -30,
  -10,
  20,
  30,
  30,
  20,
  -10,
  -30,
  -30,
  -10,
  30,
  40,
  40,
  30,
  -10,
  -30,
  -30,
  -10,
  30,
  40,
  40,
  30,
  -10,
  -30,
  -30,
  -10,
  20,
  30,
  30,
  20,
  -10,
  -30,
  -30,
  -30,
  0,
  0,
  0,
  0,
  -30,
  -30,
  -50,
  -30,
  -30,
  -30,
  -30,
  -30,
  -30,
  -50
];

export const white = Object.freeze(base);
export const black = splitMirrorAndJoin(base);
