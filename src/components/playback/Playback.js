import React from 'react';

import Icons from 'constants/icons';

const PlaybackButton = props => (
  <button
    type="button"
    className="button-icon ripple playback-button"
    icon={props.icon}
    onClick={props.onClick}
  />
);

const Playback = ({ isPlaying, actions }) => {
  const toggleIcon = isPlaying ? Icons.pause : Icons.play;

  return (
    <div id="playback-control">
      <div className="button-group">
        <PlaybackButton icon={toggleIcon} onClick={actions.togglePlay} />
      </div>
      <div id="playback-progress-container">
        <div />
      </div>
      <div className="button-group">
        <PlaybackButton icon={Icons.back} onClick={actions.goBack} />
        <PlaybackButton icon={Icons.forward} onClick={actions.goForward} />
      </div>
    </div>
  );
};

export default Playback;
