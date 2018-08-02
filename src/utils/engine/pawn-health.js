import Strings from 'constants/strings';
import { files as FILES } from 'constants/board';

const getPawns = (colour) => (x) =>
  x.contains &&
  x.contains.colour === colour &&
  x.contains.name === Strings.pieces.pawn;

const getPawnAlignment = (pieces) =>
  pieces.reduce((p, c) => {
    const value = p.get(c.file) || 0;
    return p.set(c.file, value + 1);
  }, new Map([]));

const getDoubledCount = (m) =>
  [...m.values()].reduce((p, c) => (c > 1 ? p + 1 : p), 0);

const getIsolatedCount = (m) =>
  [...m.keys()].reduce((p, c) => {
    const index = FILES.findIndex((x) => x === c);
    const left = FILES[index - 1];
    const right = FILES[index + 1];

    return (!left && m.has(right)) ||
      (!right && m.has(left)) ||
      (m.has(left) || m.has(right))
      ? p
      : p + 1;
  }, 0);

export default function checkPawnHealth(squares) {
  const wp = squares.filter(getPawns(Strings.colours.white));
  const bp = squares.filter(getPawns(Strings.colours.black));

  const wAlign = getPawnAlignment(wp);
  const bAlign = getPawnAlignment(bp);

  const doubled = getDoubledCount(wAlign) - getDoubledCount(bAlign);
  const isolated = getIsolatedCount(wAlign) - getIsolatedCount(bAlign);

  const blocked = 0;

  return doubled + blocked + isolated;
}
