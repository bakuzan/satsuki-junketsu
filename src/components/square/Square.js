import React from 'react';
import classNames from 'classnames';

import { withDropTarget } from 'components/dragAndDrop';
import Piece from 'components/piece/Piece';

import './square.scss';

class Square extends React.Component {
  constructor(props) {
    super(props);

    this.handleDragPiece = this.handleDragPiece.bind(this);
  }

  handleDragPiece(piece) {
    if (this.props.onClick) {
      this.props.onClick(this.props.id);
    }
  }

  render() {
    const {
      id,
      rank,
      file,
      isSelected,
      isPotentialMove,
      isSpecialMove,
      isInCheck,
      contains,
      onClick
    } = this.props;

    const hasPiece = !!contains;
    const label = `${file}${rank}${
      hasPiece ? `, ${contains.colour} ${contains.name}` : ''
    }`;
    const classes = classNames('square', {
      selected: isSelected,
      'potential-move': isPotentialMove && !contains,
      'potential-take': isPotentialMove && contains,
      'special-move': isSpecialMove,
      'in-check': isInCheck,
      'is-over': this.props.isOver,
      'can-drop': this.props.canDrop,
      [`rank-${rank}`]: true,
      [`file-${file}`]: true
    });

    return (
      <button
        id={id}
        className={classes}
        aria-label={label}
        onClick={() => onClick(id)}
      >
        {hasPiece && <Piece {...contains} onDrag={this.handleDragPiece} />}
      </button>
    );
  }
}

export default withDropTarget(Square);
