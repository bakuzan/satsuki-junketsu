import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Strings from 'constants/strings';
import { performSpecialMove } from 'actions/board';

const promotionChoices = [
  Strings.pieces.rook,
  Strings.pieces.knight,
  Strings.pieces.bishop,
  Strings.pieces.queen
];

const PromotionOptions = ({ promotion, actions }) => {
  if (!promotion) return null;
  return (
    <div id="promotion-options-container">
      <div>Please select a piece to promote to: </div>
      <ul>
        {promotionChoices.map(option => {
          const promoteTo = () =>
            actions.performSpecialMove({ ...promotion, promoteTo: option });
          return (
            <li key={option} id={`promote-to-${option}`}>
              <button type="button" className="button" onClick={promoteTo}>
                {option}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  promotion: {
    ...state.board.promotionAt,
    type: Strings.specialMoves.promotion
  }
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ performSpecialMove }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionOptions);
