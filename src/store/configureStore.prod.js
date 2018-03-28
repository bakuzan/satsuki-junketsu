import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from 'reducers/index';

const configureStore = (history, preloadedState) =>
  createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(routerMiddleware(history))
  );

export default configureStore;