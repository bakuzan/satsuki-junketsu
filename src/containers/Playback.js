import { connect } from 'react-redux';

import Playback from 'components/playback/Playback';

const mapStateToProps = state => ({
  isPlaying: false
});

const mapDispatchToProps = dispatch => ({
  actions: {}
});

export default connect(mapStateToProps, mapDispatchToProps)(Playback);
