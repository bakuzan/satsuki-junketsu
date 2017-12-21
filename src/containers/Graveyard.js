import { connect } from 'react-redux';

import Graveyard from 'components/graveyard/Graveyard';

const mapStateToProps = state => ({
  pieces: state.board.graveyard
});

export default connect(mapStateToProps)(Graveyard);
