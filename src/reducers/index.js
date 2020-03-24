import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import theme from './theme';
import board from './board';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    theme,
    board
  });

export default createRootReducer;
