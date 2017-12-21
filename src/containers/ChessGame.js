import React from 'react';

import Board from './Board';
import Graveyard from './Graveyard';

const ChessGame = () => (
  <div id="chess-game" className="row">
    <Board />
    <Graveyard />
  </div>
);

export default ChessGame;
