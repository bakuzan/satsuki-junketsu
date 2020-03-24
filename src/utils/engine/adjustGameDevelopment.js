import Strings from 'constants/strings';

const { pieces: Pieces } = Strings;

export default function adjustGameDevelopment(
  rating,
  moveHistory,
  { rank, contains: piece }
) {
  if (piece.name === Pieces.king) {
    if (piece.hasMoved) {
      if (piece.hasCastled) {
        rating.gameDevelopment += 4;
      } else {
        if (moveHistory.length < 30) {
          rating.gameDevelopment -= 5;
        } else {
          rating.gameDevelopment += 1;
        }
      }
    }

    return;
  }

  if (piece.hasMoved) {
    if (piece.name === Pieces.pawn) {
      rating.gameDevelopment += 1;
    } else if (piece.name === Pieces.rook || piece.name === Pieces.queen) {
      if (moveHistory.length > 7) {
        const isWhite = piece.colour === Strings.colours.white;
        const pieceInPlace =
          (rank === 1) !== isWhite || (rank === 8) !== !isWhite;

        if (pieceInPlace) {
          rating.gameDevelopment += 1;
        }
      }
    } else {
      rating.gameDevelopment += 2;
    }
  }
}
