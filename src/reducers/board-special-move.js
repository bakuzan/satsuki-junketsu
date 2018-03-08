import Strings from 'constants/strings';

function specialMoveSubReducer(state, action) {
  const { type, squareId } = action.specialMove;
  switch (type) {
    case Strings.specialMoves.promotion: {
      console.log('%c special move: promotion - not implemented', 'color: red');
      return state;
    }
    case Strings.specialMoves.enPassant: {
      console.log(
        '%c special move: en passant - not implemented',
        'color: red'
      );
      return state;
    }
    case Strings.specialMoves.castling: {
      console.log('%c special move: castling - not implemented', 'color: red');
      return state;
    }
    default:
      return state;
  }
}

export default specialMoveSubReducer;
