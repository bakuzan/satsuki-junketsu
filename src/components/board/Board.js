import React from 'react';
import classNames from 'classnames';

import Scales from 'components/scales/Scales';
import Square from 'components/square/Square';

import Constants from 'constants/index';
import { reverseArray } from 'utils/common';
import { getCurrentPlayerColour, isValidMove, isValidTake } from 'utils/game';
import './board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.handleSquareSelection = this.handleSquareSelection.bind(this);
  }

  handleSquareSelection(squareId) {
    const { squares, moves, selectedSquareId, actions } = this.props;
    const selectedSquare = squares.find(x => x.id === selectedSquareId);
    const square = squares.find(x => x.id === squareId);
    const isSameSquare = selectedSquareId === squareId;
    const currentPlayerColour = getCurrentPlayerColour(moves);

    if (!selectedSquare && !square.contains) return;
    if (selectedSquare && !square.contains)
      return isValidMove(selectedSquare, square, squares)
        ? actions.moveSelectedPiece(squareId)
        : console.log(
            '%c invalid move',
            'color: red; font-size: 22px;',
            selectedSquare,
            square
          );
    if (!selectedSquare && square.contains.colour !== currentPlayerColour)
      return;
    if (!selectedSquare && square.contains.colour === currentPlayerColour)
      return actions.selectBoardSquare(squareId);
    if (selectedSquare && isSameSquare) return actions.selectBoardSquare(null);
    if (selectedSquare && square.contains.colour === currentPlayerColour)
      return actions.selectBoardSquare(squareId);
    if (selectedSquare && square.contains.colour !== currentPlayerColour)
      return isValidTake(selectedSquare, square, squares)
        ? actions.takePiece(squareId)
        : console.log(
            '%c invalid take',
            'color: red; font-size: 22px;',
            selectedSquare,
            square
          );

    console.log(
      '%c square selection case not handled!',
      'color: red',
      `Selected square: ${selectedSquareId}, Target square: ${squareId}`
    );
  }

  render() {
    const {
      themeClass,
      squares,
      selectedSquareId,
      potentialMoves,
      isReadOnly,
      isReversed
    } = this.props;

    const boardSquares = isReversed ? reverseArray(squares) : squares;
    const boardFiles = isReversed
      ? reverseArray(Constants.files)
      : Constants.files;
    const boardRanks = isReversed
      ? reverseArray(Constants.ranks)
      : Constants.ranks;

    console.groupCollapsed('BOARD RENDER');
    console.log('selectedSquareId', selectedSquareId);
    console.log('boardSquares', boardSquares);
    console.log('props', this.props);
    console.groupEnd();

    return (
      <div
        className={classNames('chess-board', themeClass, {
          'read-only': isReadOnly
        })}
      >
        <Scales files={boardFiles} ranks={boardRanks} />
        {boardSquares.map(o => (
          <Square
            key={o.id}
            {...o}
            isPotentialMove={potentialMoves.some(x => x === o.id)}
            isSelected={o.id === selectedSquareId}
            onClick={this.handleSquareSelection}
          />
        ))}
      </div>
    );
  }
}

export default Board;
