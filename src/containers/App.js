import React from 'react';

import Header from 'components/header/Header';
import Toaster from 'components/toaster/Toaster';
import AppInformation from 'components/appInformation';

const App = React.memo(function App({ children }) {
  return (
    <div className="satsuki">
      <Header />
      <main>{children}</main>
      <Toaster />
      <AppInformation />
    </div>
  );
});

export default App;
