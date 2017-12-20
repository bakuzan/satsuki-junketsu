import Strings from 'constants/strings';

export const isWhitesTurn = moveCount => moveCount === 0 || moveCount % 2 === 0;

export const getCurrentPlayerColour = moves =>
  isWhitesTurn(moves.length) ? Strings.colours.white : Strings.colours.black;
