import {
  PLAYBACK_UPDATE_SLIDE_POSITION,
  PLAYBACK_STEP_FORWARD,
  PLAYBACK_STEP_BACK
} from 'actions/playback';
import { resolveSliderValue } from 'utils/playback';

export const PLAYBACK_STARTING_VALUE = 0;
export const getPlaybackInitialState = n => ({
  sliderMaximum: n,
  sliderPosition: n
});

function handlePlaybackStep(state, action) {
  const sliderPosition = resolveSliderValue(
    state.playback.sliderPosition + action.stepDirection,
    state.playback.sliderMaximum
  );
  return {
    ...state,
    playback: {
      ...state.playback,
      sliderPosition
    }
  };
}

function playbackSubReducer(state, action) {
  switch (action.type) {
    case PLAYBACK_UPDATE_SLIDE_POSITION: {
      const sliderPosition = action.sliderValue;
      console.log(action);
      return {
        ...state,
        playback: {
          ...state.playback,
          sliderPosition
        }
      };
    }
    case PLAYBACK_STEP_FORWARD:
      return handlePlaybackStep(state, action);
    case PLAYBACK_STEP_BACK:
      return handlePlaybackStep(state, action);
    default:
      return {
        ...state,
        playback: getPlaybackInitialState(PLAYBACK_STARTING_VALUE)
      };
  }
}

export default playbackSubReducer;
