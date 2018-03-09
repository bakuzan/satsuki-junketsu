import { connect } from 'react-redux';

import MoveList from 'components/moveList/MoveList';

const mapStateToProps = state => ({
  moves: state.board.moves
});

export default connect(mapStateToProps)(MoveList);
