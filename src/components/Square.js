import React from 'react';
import classNames from 'classnames';

import Piece from 'components/piece/Piece';

const Square = ({ rank, file, selected, inCheck, contains }) => {
  const classes = classNames('square', {
    selected: selected,
    'in-check': inCheck,
    [`rank-${rank}`]: true,
    [`file-${file}`]: true
  });

  return <div className={classes}>{!!contains && <Piece {...contains} />}</div>;
};

export default Square;
