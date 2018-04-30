import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import Strings from 'constants/strings';
import './moveList.css';

const MoveItem = ({ pgn, isActive, onClick }) => (
  <li className={classNames({ active: isActive })}>
    <button
      type="button"
      className="button"
      disabled={isActive}
      onClick={onClick}
    >
      {pgn}
    </button>
  </li>
);

const MoveList = ({ moves, activeMoveIndex, ...props }) => {
  return (
    <div id="move-list">
      <ul className="list column two">
        <li key="WHITE" className="title">
          {Strings.colours.white}
        </li>
        <li key="BLACK" className="title">
          {Strings.colours.black}
        </li>
        {moves.map((move, i) => {
          const onClick = !!props.onSelect
            ? () => props.onSelect('PLACEHOLDER NAME', i)
            : () => null;
          return (
            <MoveItem
              key={move.id}
              isActive={i === activeMoveIndex}
              onClick={onClick}
              {...move}
            />
          );
        })}
      </ul>
    </div>
  );
};

MoveList.propTypes = {
  moves: PropTypes.arrayOf(PropTypes.object),
  activeMoveIndex: PropTypes.number,
  onSelect: PropTypes.func
};

export default MoveList;
