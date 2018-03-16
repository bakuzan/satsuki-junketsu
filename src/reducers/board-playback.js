import {
  PLAYBACK_UPDATE_SLIDE_POSITION,
  PLAYBACK_STEP_FORWARD,
  PLAYBACK_STEP_BACK
} from 'actions/playback';
import { resolveSliderValue } from 'utils/playback';

export const playbackInitialState = {
  sliderPosition: 100
};

function handlePlaybackStep(state, action) {
  const stepValue = Math.round(100 / state.moves.length, 2);
  const sliderPosition = resolveSliderValue(
    state.playback.sliderPosition + stepValue * action.stepDirection
  );
  return { ...state, playback: { sliderPosition } };
}

function playbackSubReducer(state, action) {
  switch (action.type) {
    case PLAYBACK_UPDATE_SLIDE_POSITION: {
      const sliderPosition = action.sliderValue;
      return {
        ...state,
        playback: { sliderPosition }
      };
    }
    case PLAYBACK_STEP_FORWARD:
      return handlePlaybackStep(state, action);
    case PLAYBACK_STEP_BACK:
      return handlePlaybackStep(state, action);
    default:
      return {
        ...state,
        playback: playbackInitialState
      };
  }
}

export default playbackSubReducer;
