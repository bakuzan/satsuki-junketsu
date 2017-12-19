import React from 'react';
import { connect } from 'react-redux';

const App = ({ children }) => (
  <div className="satsuki">
    <main>{children}</main>
  </div>
);

export default connect(mapStateToProps)(App);
