import React from 'react';
import classNames from 'classnames';

import './piece.css';

const Piece = ({ name, colour }) => (
  <div className={classNames('piece', ([`${colour}-${name}`]: true))} />
);

export default Piece;
