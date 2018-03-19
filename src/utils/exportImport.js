import { formatDate } from './common';
import { mapMovesToPGN } from './pgn';

export const exportPGNForMoves = moves => {
  const pgnForMoves = mapMovesToPGN(moves);
  let moveNumber = 1;
  const pgn = pgnForMoves.reduce((p, c, i) => {
    const hasNumber = i === 0 || i % 2 === 0;
    const nextStr = hasNumber ? ` ${moveNumber}. ${c.pgn}` : `${c.pgn}`;
    if (!hasNumber) moveNumber++;
    return `${p} ${nextStr}${!hasNumber && moveNumber === 6 ? `\n` : ''}`;
  }, '');

  const date = formatDate(new Date());
  const dataForFile = `
  [Site "https://bakuzan.github.io/satsuki-junketsu/"]
  [Date "${date}"]

  ${pgn}
  `;

  download(
    processDataIntoDownloadUrl(dataForFile),
    `chess-game-${new Date().toLocaleString()}.pgn`
  );
};

const processDataIntoDownloadUrl = dataStr =>
  URL.createObjectURL(new Blob([dataStr]));

export function download(downloadUrl, fileName) {
  const link = document.createElement('a');
  link.setAttribute('href', downloadUrl);
  link.setAttribute('download', fileName);
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}

export const importPGNFromFile = fileText => {
  const [gameInformation, ...movePairs] = fileText.split(/\d\./g);
  const pgnMoves = movePairs.reduce(
    (p, movePair) => [
      ...p,
      ...movePair
        .split(' ')
        .filter(x => !!x)
        .map(x => x.replace(/\n/g, ''))
    ],
    []
  );
  return { gameInformation, pgnMoves };
};
