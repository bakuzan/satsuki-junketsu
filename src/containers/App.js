import React from 'react';

import Header from 'components/header/Header';

const App = ({ children }) => (
  <div className="satsuki">
    <Header />
    <main>{children}</main>
  </div>
);

export default App;
