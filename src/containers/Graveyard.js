import React from 'react';
import { connect } from 'react-redux';

import Graveyard from 'components/graveyard/Graveyard';

import Constants from 'constants/index';

const DualGraveyards = ({ whitePieces, blackPieces }) => (
  <div id="paired-graveyards">
    <Graveyard pieces={whitePieces} />
    <Graveyard pieces={blackPieces} />
  </div>
);

const getPiecesForColour = (state, colour) =>
  state.board.graveyard.filter(x => x.colour === colour);
const mapStateToProps = state => ({
  whitePieces: getPiecesForColour(state, Constants.Strings.colours.white),
  blackPieces: getPiecesForColour(state, Constants.Strings.colours.black)
});

export default connect(mapStateToProps)(DualGraveyards);
