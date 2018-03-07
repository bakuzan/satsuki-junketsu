import React from 'react';
import classNames from 'classnames';

import Piece from 'components/piece/Piece';

import './square.css';

const Square = ({
  id,
  rank,
  file,
  isSelected,
  isPotentialMove,
  isSpecialMove,
  isInCheck,
  contains,
  onClick
}) => {
  const classes = classNames('square', {
    selected: isSelected,
    'potential-move': isPotentialMove && !contains,
    'potential-take': isPotentialMove && contains,
    'special-move': isSpecialMove,
    'in-check': isInCheck,
    [`rank-${rank}`]: true,
    [`file-${file}`]: true
  });

  return (
    <div id={id} className={classes} onClick={() => onClick(id)}>
      {!!contains && <Piece {...contains} />}
    </div>
  );
};

export default Square;
