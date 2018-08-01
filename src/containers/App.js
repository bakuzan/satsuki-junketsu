import React from 'react';

import Header from 'components/header/Header';
import Toaster from 'components/toaster/Toaster';

const App = ({ children }) => (
  <div className="satsuki">
    <Header />
    <main>{children}</main>
    <Toaster />
  </div>
);

export default App;
