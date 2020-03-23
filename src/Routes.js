import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import App from 'containers/App';
import ChessGame from 'containers/ChessGame';

import { Paths } from 'constants/paths';

const SatsukiRoutes = ({ match }) => (
  <Switch>
    <Route exact path={match.path} component={ChessGame} />
  </Switch>
);

const Routes = ({ history }) => (
  <ConnectedRouter history={history}>
    <App>
      <Switch>
        <Redirect exact from="/" to={Paths.base} />
        <Route path={Paths.base} component={SatsukiRoutes} />

        <Route path="*" render={() => <div>Page not found</div>} />
      </Switch>
    </App>
  </ConnectedRouter>
);

export default Routes;
