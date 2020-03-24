import Strings from 'constants/strings';
import { files as Files } from 'constants/board';

const { pieces: Pieces } = Strings;

export default function calculateSquareControl(
  rating,
  moveHistory,
  teamMateCount,
  { possibleMoves, contains: piece, ...square }
) {
  //sum the value of all the squares where each piece can move, attack, or defend
  //calculated regardless of if the square is under attack
  //maybe go through each piece and each move and make a board array that sums the number of pieces controlling or attacking a square
  //and calculate it that way
  let rowValArray = [0, 1, 3, 6, 6, 3, 1, 0];
  let colValArray = [0, 1, 3, 6, 6, 3, 1, 0];

  if (piece.name === Pieces.pawn) {
    //calculate only attacked squares for pawns (diagonals)
    if (moveHistory.length > 50 && teamMateCount < 8) {
      if (piece.colour === Strings.colours.white) {
        rowValArray = [0, 1, 2, 3, 4, 5, 6, 7];
      } else {
        rowValArray = [7, 6, 5, 4, 3, 2, 1, 0];
      }
    }

    rating.squareControl += getPawnValue();
  }

  // TODO - check this part...
  /* legal if:
   *    king not attacked
   *    king attacked by more than 1
   *    king attacked by 1, and that 1 is not being attacked
   * potential if:
   *    king being attacked by 1 attacker, that is being attacked
   */

  const totalMoves = possibleMoves.length;

  let squareValueSum = possibleMoves.reduce(
    (p, sq) =>
      p +
      rowValArray[sq.rank - 1] +
      colValArray[Files.findIndex((x) => x === sq.file)],
    0
  );

  if (totalMoves > 10) {
    squareValueSum /= 1.5;
  }

  rating.squareControl += squareValueSum;

  function getPawnValue() {
    const fileIndex = Files.findIndex((x) => x === square.file);
    if (fileIndex > 1) {
      //if the pawn can move left
      return getSquareValuePawn(fileIndex, 1);
    } else if (fileIndex < 7) {
      //if the pawn can move right
      return getSquareValuePawn(fileIndex, -1);
    }
  }

  function getSquareValuePawn(fileIndex, leftOrRightMove) {
    const rankIndex = square.rank - 1;

    // promotion highly favorable
    if (rankIndex === 0 || rankIndex === 7) {
      return 9 * 50;
    }

    const direction = piece.colour === Strings.colours.white ? 1 : -1;
    return [rankIndex + direction, fileIndex + leftOrRightMove].reduce(
      (p, c) => p + c
    );
  }
}
