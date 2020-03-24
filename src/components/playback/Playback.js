import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import Icons from 'constants/icons';
import { SLIDER_START } from 'constants/slider';
import './playback.scss';

const PlaybackButton = ({ className, ...props }) => (
  <button
    type="button"
    className={classNames('button-icon ripple playback-button', className)}
    {...props}
  />
);

const STEP_FORWARD = 1;
const STEP_BACK = -1;

class Playback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false
    };
    this.timer = null;
    this.previousPosition = null;

    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.createSliderStepHandler = this.createSliderStepHandler.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  handleTogglePlay() {
    this.setState(
      (prev) => ({ isPlaying: !prev.isPlaying }),
      () => {
        clearInterval(this.timer);
        if (!this.state.isPlaying) {
          return;
        }

        if (this.props.sliderPosition === this.props.sliderMaximum) {
          this.props.actions.onSlide(this.props.name, SLIDER_START);
        }

        this.timer = setInterval(() => {
          if (this.previousPosition === this.props.sliderMaximum) {
            return this.stopPlaying();
          }

          this.previousPosition = this.props.sliderPosition;
          this.props.actions.onStepForward(this.props.name, STEP_FORWARD);
        }, this.props.playbackInterval);
      }
    );
  }

  stopPlaying() {
    clearInterval(this.timer);
    this.previousPosition = null;
    this.setState({ isPlaying: false });
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
    this.props.actions.onSlide(name, Number(value));
  }

  render() {
    const { isPlaying } = this.state;
    const {
      name,
      isDisabled,
      isHidden,
      sliderPosition,
      sliderMaximum
    } = this.props;

    if (isHidden) {
      return null;
    }

    const AT_THE_START = sliderPosition === SLIDER_START;
    const AT_THE_END = sliderPosition === sliderMaximum;
    const width = (sliderPosition / sliderMaximum) * 100;
    const toggleData = isPlaying
      ? { icon: Icons.pause, 'aria-label': 'Pause playback' }
      : { icon: Icons.play, 'aria-label': 'Start playback' };

    const sliderStyle = {
      backgroundImage: `linear-gradient(90deg, currentcolor, currentcolor ${width}%, #ddd ${width}%)`
    };

    return (
      <div id="playback-control">
        <div className="button-group">
          <PlaybackButton
            className="playback-toggle-play"
            {...toggleData}
            onClick={this.handleTogglePlay}
            disabled={isDisabled}
          />
        </div>
        <div id="playback-progress-container" className="range-slider">
          <input
            type="range"
            name={name}
            aria-label="playback slider"
            style={sliderStyle}
            value={sliderPosition}
            max={sliderMaximum}
            disabled={isDisabled}
            onChange={this.handleSliderChange}
          />
        </div>
        <div className="button-group">
          <PlaybackButton
            className="playback-back"
            aria-label="Move playback backward a step"
            icon={Icons.back}
            onClick={this.createSliderStepHandler(STEP_BACK)}
            disabled={AT_THE_START || isDisabled}
          />
          <PlaybackButton
            className="playback-forward"
            aria-label="Move playback forward a step"
            icon={Icons.forward}
            onClick={this.createSliderStepHandler(STEP_FORWARD)}
            disabled={AT_THE_END || isDisabled}
          />
        </div>
      </div>
    );
  }
}

Playback.defaultProps = {
  name: 'slider',
  sliderMaximum: 100,
  playbackInterval: 1000,
  isDisabled: false,
  isHidden: false
};

Playback.propTypes = {
  name: PropTypes.string,
  sliderMaximum: PropTypes.number,
  playbackInterval: PropTypes.number,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  sliderPosition: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    onSlide: PropTypes.func.isRequired,
    onStepForward: PropTypes.func.isRequired,
    onStepBack: PropTypes.func.isRequired
  }).isRequired
};

export default Playback;
