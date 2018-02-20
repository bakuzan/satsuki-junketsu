import React from 'react';
import classNames from 'classnames';

import Portal from 'components/Portal';
import Scales from 'components/scales/Scales';
import Square from 'components/square/Square';

import Constants from 'constants/index';
import { reverseArray, capitalise } from 'utils/common';
import { getWinningPlayerColour, isValidMove, isValidTake } from 'utils/game';
import './board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.handleSquareSelection = this.handleSquareSelection.bind(this);
  }

  handleSquareSelection(squareId) {
    const { squares, selectedSquareId, actions } = this.props;
    const selectedSquare = squares.find(x => x.id === selectedSquareId);
    const square = squares.find(x => x.id === squareId);
    const isSameSquare = selectedSquareId === squareId;
    const currentPlayerColour = this.props.currentPlayerColour;

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
      currentPlayerColour,
      potentialMoves,
      checkStatus,
      isReversed
    } = this.props;

    const boardSquares = isReversed ? reverseArray(squares) : squares;
    const boardFiles = isReversed
      ? reverseArray(Constants.files)
      : Constants.files;
    const boardRanks = isReversed
      ? reverseArray(Constants.ranks)
      : Constants.ranks;

    const checkedKingSquareId =
      !!checkStatus.attackers.length && checkStatus.kingSquare.id;
    const isReadOnly = checkStatus.isCheckmate;
    const onSquareClick = isReadOnly ? () => null : this.handleSquareSelection;

    console.groupCollapsed('BOARD RENDER');
    console.log('selectedSquareId', selectedSquareId);
    console.log('boardSquares', boardSquares);
    console.log('props', this.props);
    console.log('isReadOnly', isReadOnly);
    console.groupEnd();

    return (
      <React.Fragment>
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
              isInCheck={o.id === checkedKingSquareId}
              isSelected={o.id === selectedSquareId}
              onClick={onSquareClick}
            />
          ))}
        </div>
        <Portal targetSelector="#chess-game-status">
          {!checkStatus.isCheckmate &&
            `Current player: ${capitalise(currentPlayerColour)}`}
          {checkStatus.isCheckmate &&
            `Winner: ${getWinningPlayerColour(checkStatus.kingSquare)}`}
        </Portal>
      </React.Fragment>
    );
  }
}

export default Board;
