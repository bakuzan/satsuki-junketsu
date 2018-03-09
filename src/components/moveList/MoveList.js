import React from 'react';

import './moveList.css';

const MoveItem = ({ text }) => <li>{text}</li>;

const MoveList = ({ moves }) => {
  return (
    <div id="move-list">
      <ul className="list column two">
        {moves.map(move => <MoveItem key={move.id} {...move} />)}
      </ul>
    </div>
  );
};

export default MoveList;
