import React from 'react';
import classNames from 'classnames';

import Scales from 'components/scales/Scales';
import Square from 'components/Square';

import Constants from 'constants/index';

const Board = ({ layout, readOnly }) => (
  <div className={classNames('chess-board', { 'read-only': readOnly })}>
    <Scales files={Constants.files} ranks={Constants.ranks} />
    {layout.squares.map(o => <Square key={o.id} {...o} />)}
  </div>
);

export default Board;
