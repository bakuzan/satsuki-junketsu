import React from 'react';

import Strings from 'constants/strings';
import './moveList.css';

const MoveItem = ({ pgn }) => <li>{pgn}</li>;

const MoveList = ({ moves }) => {
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
        {moves.map(move => <MoveItem key={move.id} {...move} />)}
      </ul>
    </div>
  );
};

export default MoveList;
