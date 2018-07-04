import React from 'react';
import classNames from 'classnames';

import { withDropTarget } from 'components/dragAndDrop';
import Piece from 'components/piece/Piece';

import './square.css';

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
    
    const classes = classNames('square', {
      'selected': isSelected,
      'potential-move': isPotentialMove && !contains,
      'potential-take': isPotentialMove && contains,
      'special-move': isSpecialMove,
      'in-check': isInCheck,
      [`rank-${rank}`]: true,
      [`file-${file}`]: true
    });

    console.log('square', this.props);
    return (
      <div id={id} className={classes} onClick={() => onClick(id)}>
        {!!contains && <Piece {...contains} onDrag={this.handleDragPiece} />}
      </div>
    );
  };
}

export default withDropTarget(Square);
