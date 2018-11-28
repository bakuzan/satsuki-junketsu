import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';

import Routes from './Routes';
import registerServiceWorker from './registerServiceWorker';
import AutomateBoard from './programmatic-board-moves';
import './index.scss';
import './styles/list.scss';
import './styles/float-label.scss';
import './styles/ripple.scss';
import './styles/button.scss';
import './styles/themes.scss';

import Engine from 'utils/engine';
window.Engine = Engine;
window.AutomateBoard = AutomateBoard;
const history = createHistory();
const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
