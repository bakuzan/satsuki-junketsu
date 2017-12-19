import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import theme from './theme';
import requestIndicator from './request-indicator';

const rootReducer = combineReducers({
  routing,
  theme,
  requestIndicator
});

export default rootReducer;
