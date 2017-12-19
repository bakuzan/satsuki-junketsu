import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import theme from './theme';

const rootReducer = combineReducers({
  routing,
  theme
});

export default rootReducer;
