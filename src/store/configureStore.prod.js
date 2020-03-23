import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from 'reducers/index';

const configureStore = (history, preloadedState) =>
  createStore(
    createRootReducer(history),
    preloadedState,
    applyMiddleware(routerMiddleware(history))
  );

export default configureStore;
