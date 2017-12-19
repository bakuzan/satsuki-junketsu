import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import rootReducer from 'reducers/index';

const configureStore = (history, preloadedState) => {
  const middlewares = [routerMiddleware(history), createLogger()];
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension && process.env.NODE_ENV !== 'production'
        ? window.devToolsExtension()
        : f => f
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
