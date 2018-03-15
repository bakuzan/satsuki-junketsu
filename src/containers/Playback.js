import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Playback from 'components/playback/Playback';
import * as actions from 'actions/playback';

const mapStateToProps = state => ({
  sliderPosition: 0
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      onSlide: actions.updateSlidePosition,
      onStepForward: actions.stepSliderForward,
      onStepBack: actions.stepSliderBack
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Playback);
