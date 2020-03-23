import React from 'react';

import { Piece } from 'components/piece/Piece';

import './graveyard.scss';

const Graveyard = ({ pieces }) => (
  <div className="graveyard">
    {pieces.map((p, i) => (
      <Piece key={i} {...p} />
    ))}
  </div>
);

export default Graveyard;
