import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';

import Routes from './Routes';
import registerServiceWorker from './registerServiceWorker';
import AutomateBoard from './programmatic-board-moves';
import './index.css';
import './styles/list.css';
import './styles/float-label.css';
import './styles/ripple.css';
import './styles/button.css';
import './styles/themes.css';

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
