export const PLAYBACK_UPDATE_SLIDE_POSITION = 'PLAYBACK_UPDATE_SLIDE_POSITION';
export const updateSlidePosition = (sliderName, sliderValue) => ({
  type: PLAYBACK_UPDATE_SLIDE_POSITION,
  sliderValue
});

export const PLAYBACK_STEP_FORWARD = 'PLAYBACK_STEP_FORWARD';
export const stepSliderForward = (sliderName, stepDirection) => ({
  type: PLAYBACK_STEP_FORWARD,
  stepDirection
});

export const PLAYBACK_STEP_BACK = 'PLAYBACK_STEP_BACK';
export const stepSliderBack = (sliderName, stepDirection) => ({
  type: PLAYBACK_STEP_BACK,
  stepDirection
});
