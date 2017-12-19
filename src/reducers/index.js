import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import theme from './theme';
import board from './board';

const rootReducer = combineReducers({
  routing,
  theme,
  board
});

export default rootReducer;
