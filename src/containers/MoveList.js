import { connect } from 'react-redux';

import MoveList from 'components/moveList/MoveList';

import { mapMovesToPGN } from 'utils/pgn';
import { getMoveIndexForPlayback } from 'utils/playback';

const mapStateToProps = state => ({
  moves: mapMovesToPGN(state.board.moves),
  activeMoveIndex: getMoveIndexForPlayback(
    state.board.moves,
    state.board.playback
  )
});

export default connect(mapStateToProps)(MoveList);
