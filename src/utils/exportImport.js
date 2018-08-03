import { formatDate } from './common';
import { mapMovesToPGN } from './pgn';

import * as Regexes from 'constants/regex';

const PLAYER = 'Player';
const COMPUTER = 'Computer';
const TEXT_IN_QUOTES = /\\.|"([^"\\]*\\.)*[^"\\]*"/;

export const exportPGNForMoves = (moves, vsComputer) => {
  const pgnForMoves = mapMovesToPGN(moves);
  let moveNumber = 1;
  const pgn = pgnForMoves.reduce((p, c, i) => {
    const hasNumber = i === 0 || i % 2 === 0;
    const nextStr = hasNumber ? ` ${moveNumber}. ${c.pgn}` : `${c.pgn}`;
    if (!hasNumber) moveNumber++;
    return `${p} ${nextStr}${!hasNumber && moveNumber % 5 === 0 ? `\n ` : ''}`;
  }, '');

  const date = formatDate(new Date());
  const players = !vsComputer.isComputer
    ? [PLAYER, PLAYER]
    : vsComputer.isComputerBlack ? [PLAYER, COMPUTER] : [COMPUTER, PLAYER];

  const dataForFile = `
  [Site "https://bakuzan.github.io/satsuki-junketsu/"]
  [Date "${date}"]
  [White "${players[0]}"]
  [Black "${players[1]}"]
  ${pgn}
  `;

  download(
    processDataIntoDownloadUrl(dataForFile),
    `chess-game-${new Date().toLocaleString()}.pgn`
  );
};

const processDataIntoDownloadUrl = (dataStr) =>
  URL.createObjectURL(new Blob([dataStr]));

export function download(downloadUrl, fileName) {
  const link = document.createElement('a');
  link.setAttribute('href', downloadUrl);
  link.setAttribute('download', fileName);
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}

const getProcessedLine = (arr, str) => {
  const line = arr.find((x) => x.includes(str));
  if (!line) return '';
  return line.match(TEXT_IN_QUOTES)[0].replace(/"/g, '');
};

const resolvePlayers = (information) => {
  const lines = information.split('\n');
  const wPlayer = getProcessedLine(lines, 'White');
  const bPlayer = getProcessedLine(lines, 'Black');

  return {
    isComputer: wPlayer === COMPUTER || bPlayer === COMPUTER,
    isComputerBlack: bPlayer === COMPUTER
  };
};

export const importPGNFromFile = (fileText) => {
  const [gameInformation, ...movePairs] = fileText
    .replace(Regexes.MATCH_PGN_COMMENTS_PGN_GAME_RESULT, '')
    .split(Regexes.MATCH_DIGIT_DOT_SPACE);

  const pgnMoves = movePairs.reduce(
    (p, movePair) => [
      ...p,
      ...movePair
        .replace(Regexes.MATCH_NEW_LINE, ' ')
        .split(' ')
        .filter((x) => !!x && isNaN(x))
    ],
    []
  );

  const vsComputer = resolvePlayers(gameInformation);

  return { gameInformation, pgnMoves, vsComputer };
};
