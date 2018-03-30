import { connect } from 'react-redux';

import MoveList from 'components/moveList/MoveList';
import { mapMovesToPGN } from 'utils/pgn';

const mapStateToProps = state => ({
  moves: mapMovesToPGN(state.board.moves),
  activeMoveIndex: state.board.playback.sliderPosition
});

export default connect(mapStateToProps)(MoveList);
