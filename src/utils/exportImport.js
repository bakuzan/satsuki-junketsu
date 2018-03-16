import { formatDate } from './common';
import { mapMovesToPGN } from './pgn';

export const exportPGNForMoves = moves => {
  const pgnForMoves = mapMovesToPGN(moves);
  let moveNumber = 1;
  const pgn = pgnForMoves.reduce((p, c, i) => {
    const hasNumber = i === 0 || i % 2 === 0;
    const nextStr = hasNumber ? ` ${moveNumber}. ${c.pgn}` : ` ${c.pgn}`;
    if (!hasNumber) moveNumber++;
    return `${p} ${nextStr}${!hasNumber && moveNumber === 6 ? `\n` : ''}`;
  }, '');

  const date = formatDate(new Date());
  console.log(
    'export PGN > ',
    `[Site "https://bakuzan.github.io/satsuki-junketsu/"]
     [Date "${date}"]

     ${pgn}
    `
  );
};
