import React from 'react';
import classNames from 'classnames';

import Piece from 'components/piece/Piece';

const Square = ({
  id,
  rank,
  file,
  isSelected,
  isInCheck,
  contains,
  onClick
}) => {
  const classes = classNames('square', {
    selected: isSelected,
    'in-check': isInCheck,
    [`rank-${rank}`]: true,
    [`file-${file}`]: true
  });

  return (
    <div className={classes} onClick={() => onClick(id)}>
      {!!contains && <Piece {...contains} />}
    </div>
  );
};

export default Square;