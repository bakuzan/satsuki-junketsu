import { connect } from 'react-redux';

import Board from 'components/board/Board';

const mapStateToProps = state => ({
  layout: state.board
});

export default connect(mapStateToProps)(Board);
