import PropTypes from 'prop-types';
import React from 'react';

import Portal from 'components/Portal';
import GameAction from 'components/GameAction';

import Options from 'constants/new-game-options';

import './newGameOptions.css';

const NewGameOptions = ({ display, targetSelector, onSelect }) => {
  if (!display) return null;

  return (
    <Portal targetSelector={targetSelector}>
      <div className="game-options">
        <p>Select game type</p>
        <ul className="list column one">
          {Options.map((o) => (
            <li key={o.id}>
              <GameAction
                id={`new-game-option-${o.id}`}
                onClick={() => onSelect(o.id)}
              >
                {o.text}
              </GameAction>
            </li>
          ))}
        </ul>
      </div>
    </Portal>
  );
};

NewGameOptions.propTypes = {
  targetSelector: PropTypes.string.isRequired,
  display: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
};

export default NewGameOptions;
