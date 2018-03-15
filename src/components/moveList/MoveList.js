import classNames from 'classnames';
import React from 'react';

import Strings from 'constants/strings';
import './moveList.css';

const MoveItem = ({ pgn, isActive }) => (
  <li className={classNames({ active: isActive })}>{pgn}</li>
);

const MoveList = ({ moves, activeMoveIndex }) => {
  console.log('moves', moves);
  return (
    <div id="move-list">
      <ul className="list column two">
        <li key="WHITE" className="title">
          {Strings.colours.white}
        </li>
        <li key="BLACK" className="title">
          {Strings.colours.black}
        </li>
        {moves.map((move, i) => (
          <MoveItem key={move.id} isActive={i === activeMoveIndex} {...move} />
        ))}
      </ul>
    </div>
  );
};

export default MoveList;
