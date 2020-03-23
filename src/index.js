import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';

import Routes from './Routes';
import registerServiceWorker from './registerServiceWorker';
import AutomateBoard from './programmatic-board-moves';
import Engine from 'utils/engine';
import './styles/index.scss';

window.Engine = Engine;
window.AutomateBoard = AutomateBoard;

const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
