import React from 'react';
import classNames from 'classnames';

import Portal from 'components/Portal';
import Scales from 'components/scales/Scales';
import Square from 'components/square/Square';
import PromotionOptions from 'components/promotionOptions/PromotionOptions';

import Constants from 'constants/index';
import { reverseArray, capitalise } from 'utils/common';
import { getWinningPlayerColour } from 'utils/game';
import './board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.handleSquareSelection = this.handleSquareSelection.bind(this);
    this.handleCanDrop = this.handleCanDrop.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleSquareSelection(squareId) {
    const {
      squares,
      potentialMoves,
      specialMoves,
      selectedSquareId,
      actions
    } = this.props;
    const selectedSquare = squares.find(x => x.id === selectedSquareId);
    const square = squares.find(x => x.id === squareId);
    const isSameSquare = selectedSquareId === squareId;
    const currentPlayerColour = this.props.currentPlayerColour;
    const isPotentialMove = potentialMoves.some(x => x === squareId);
    const specialMove = specialMoves.find(x => x.squareId === squareId);
    const isSpecialMove = !!specialMove;

    if (!selectedSquare && !square.contains) return;

    if (selectedSquare && !square.contains)
      return isSpecialMove
        ? actions.performSpecialMove(specialMove)
        : isPotentialMove
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
      return isSpecialMove
        ? actions.performSpecialMove(specialMove)
        : isPotentialMove
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

  handleCanDrop(squareId) {
    const { potentialMoves, specialMoves } = this.props;
    const isPotentialMove = potentialMoves.some(x => x === squareId);
    const specialMove = specialMoves.find(x => x.squareId === squareId);
    const isSpecialMove = !!specialMove;

    return isPotentialMove || isSpecialMove;
  }

  handleDrop(squareId) {
    this.handleSquareSelection(squareId);
  }

  render() {
    const {
      style,
      themeClass,
      squares,
      selectedSquareId,
      currentPlayerColour,
      potentialMoves,
      specialMoves,
      checkStatus,
      isReversed,
      isReadOnly
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
    const isCheck = !!checkedKingSquareId;
    const isLocked = isReadOnly || checkStatus.isCheckmate;
    const onSquareClick = isLocked ? () => null : this.handleSquareSelection;

    const dropActions = {
      canDrop: this.handleCanDrop,
      onDrop: this.handleDrop
    };
    console.groupCollapsed('BOARD RENDER');
    console.log('selectedSquareId', selectedSquareId);
    console.log('boardSquares', boardSquares);
    console.log('props', this.props);
    console.log('isLocked', isLocked);
    console.groupEnd();

    return (
      <React.Fragment>
        <div
          style={style}
          className={classNames('chess-board', themeClass, {
            'read-only': isLocked
          })}
        >
          <Scales files={boardFiles} ranks={boardRanks} />
          {boardSquares.map(o => (
            <Square
              key={o.id}
              {...o}
              isPotentialMove={potentialMoves.some(x => x === o.id)}
              isSpecialMove={specialMoves.some(x => x.squareId === o.id)}
              isInCheck={o.id === checkedKingSquareId}
              isSelected={o.id === selectedSquareId}
              onClick={onSquareClick}
              dropActions={dropActions}
            />
          ))}
        </div>
        <Portal targetSelector="#chess-game-status">
          {!checkStatus.isCheckmate && (
            <React.Fragment>
              <PromotionOptions />
              {`${capitalise(currentPlayerColour)}'s turn`}
              {isCheck && `\n${capitalise(currentPlayerColour)} is in Check!`}
            </React.Fragment>
          )}
          {checkStatus.isCheckmate &&
            `Winner: ${getWinningPlayerColour(checkStatus.kingSquare)}`}
        </Portal>
      </React.Fragment>
    );
  }
}

export default Board;
