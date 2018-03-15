import PropTypes from 'prop-types';
import React from 'react';

import Icons from 'constants/icons';
import './playback.css';

const PlaybackButton = props => (
  <button
    type="button"
    className="button-icon ripple playback-button"
    icon={props.icon}
    disabled={props.disabled}
    onClick={props.onClick}
  />
);

const SLIDER_START = 0;
const SLIDER_END = 100;
const STEP_FORWARD = 1;
const STEP_BACK = -1;

class Playback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false
    };

    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.createSliderStepHandler = this.createSliderStepHandler.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  handleTogglePlay() {
    this.setState(
      prev => ({ isPlaying: !prev.isPlaying }),
      () => {
        clearInterval(this.timer);
        if (!this.state.isPlaying) return;

        this.timer = setInterval(() => {
          if (this.props.sliderPosition === SLIDER_END)
            clearInterval(this.timer);
          else this.props.actions.onStepForward(this.props.name, STEP_FORWARD);
        }, this.props.playbackInterval);
      }
    );
  }

  createSliderStepHandler(stepDirection) {
    const handler =
      stepDirection === STEP_FORWARD
        ? this.props.actions.onStepForward
        : this.props.actions.onStepBack;
    return () => handler(this.props.name, stepDirection);
  }

  handleSliderChange(event) {
    const { name, value } = event.target;
    this.props.actions.onSlide(name, value);
  }

  render() {
    const { isPlaying } = this.state;
    const { name, sliderPosition } = this.props;
    const toggleIcon = isPlaying ? Icons.pause : Icons.play;
    const width = sliderPosition;
    const sliderStyle = {
      backgroundImage: `linear-gradient(90deg, currentcolor, currentcolor ${width}%, transparent ${width}%)`
    };

    return (
      <div id="playback-control">
        <div className="button-group">
          <PlaybackButton icon={toggleIcon} onClick={this.handleTogglePlay} />
        </div>
        <div id="playback-progress-container" className="range-slider">
          <input
            type="range"
            name={name}
            style={sliderStyle}
            value={sliderPosition}
            onChange={this.handleSliderChange}
          />
        </div>
        <div className="button-group">
          <PlaybackButton
            icon={Icons.back}
            onClick={this.createSliderStepHandler(STEP_BACK)}
            disabled={sliderPosition === SLIDER_START}
          />
          <PlaybackButton
            icon={Icons.forward}
            onClick={this.createSliderStepHandler(STEP_FORWARD)}
            disabled={sliderPosition === SLIDER_END}
          />
        </div>
      </div>
    );
  }
}

Playback.defaultProps = {
  name: 'slider',
  playbackInterval: 1000
};

Playback.propTypes = {
  name: PropTypes.string,
  playbackInterval: PropTypes.number,
  sliderPosition: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    onSlide: PropTypes.func.isRequired,
    onStepForward: PropTypes.func.isRequired,
    onStepBack: PropTypes.func.isRequired
  }).isRequired
};

export default Playback;
