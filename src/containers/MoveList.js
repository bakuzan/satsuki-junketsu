import { connect } from 'react-redux';

import MoveList from 'components/moveList/MoveList';

import { updateSlidePosition } from 'actions/playback';
import { mapMovesToPGN } from 'utils/pgn';

const mapStateToProps = state => ({
  moves: mapMovesToPGN(state.board.moves),
  activeMoveIndex: state.board.playback.sliderPosition
});

const mapDispatchToProps = {
  onSelect: updateSlidePosition
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveList);
