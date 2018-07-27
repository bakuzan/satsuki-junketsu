import { getCurrentPlayerColour } from './game';
import { possibleMovesForSelectedPiece } from './piece';
import availableSpecialMovesForSelectedPiece from './specialMoves';

import performMovementFromCurrentToTarget from './squaresUpdate';

const getPieceCount = (arr, pieceName) =>
  arr.filter((x) => x.contains.name === pieceName).length;

const getScoreForPiece = (weight, pieceName) => (aSq, bSq) =>
  weight * (getPieceCount(aSq, pieceName) - getPieceCount(bSq, pieceName));

const scoreKings = getScoreForPiece(200, 'king');
const scoreQueens = getScoreForPiece(9, 'queen');
const scoreRooks = getScoreForPiece(5, 'rook');
const scorePawns = getScoreForPiece(1, 'pawn');
const scoreBishopsAndKnights = (aSq, bSq) =>
  3 *
  (getPieceCount(aSq, 'bishop') -
    getPieceCount(bSq, 'bishop') +
    (getPieceCount(aSq, 'knight') - getPieceCount(bSq, 'knight')));

function evaluateBoard(playingAsColour) {
  return (board) => {
    const { squares } = board;
    const p = squares.filter(
      (x) => x.contains && x.contains.colour === playingAsColour
    );
    const op = squares.filter(
      (x) => x.contains && x.contains.colour !== playingAsColour
    );

    let score =
      scoreKings(p, op) +
      scoreQueens(p, op) +
      scoreRooks(p, op) +
      scorePawns(p, op) +
      scoreBishopsAndKnights(p, op);

    return score;
  };
}

export default function sjChessEngine(board) {
  const { moves, squares } = board;
  const currentColour = getCurrentPlayerColour(moves);
  const getBoardScore = evaluateBoard(currentColour);
  const pieceSquares = squares.filter(
    (x) => x.contains && x.contains.colour === currentColour
  );

  const pieceMoves = pieceSquares.reduce((p, sq) => {
    const squareId = sq.id;
    const fakeBoardState = {
      ...board,
      selectedSquareId: squareId,
      squares
    };
    const possibleMoves = possibleMovesForSelectedPiece(fakeBoardState);
    const possibleSMoves = availableSpecialMovesForSelectedPiece(
      fakeBoardState
    );

    const moveResults = possibleMoves.map((targetId) =>
      getBoardScore(
        performMovementFromCurrentToTarget(board, squareId, targetId)
      )
    );

    // TODO will require refactor of board-specialMove reducer
    const specialMoveResults = possibleSMoves.map((targetId) => targetId);

    return [...p, { squareId, moveResults, specialMoveResults }];
  }, []);

  console.groupCollapsed('%c engine in progress', 'color: magenta');
  console.log('input > ', board);
  console.log('current player > ', currentColour);
  console.log('pieces > ', pieceSquares);
  console.log('moves for pieces > ', pieceMoves);
  console.groupEnd();

  /* TODO
   *
   * 1) forEach item in moveResults
   *        compare to current, give a 'score' to the move.
   *
   * 2) pick best scoring move, perform move
   * 
   * 3) return something that can be used to trigger redux actions
   *       
   */
}
