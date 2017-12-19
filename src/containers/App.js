import React from 'react';

import AppSettings from './AppSettings';

const App = ({ children }) => (
  <div className="satsuki">
    <AppSettings />
    <main>{children}</main>
  </div>
);

export default App;
