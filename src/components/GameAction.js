import React from 'react';

const GameAction = ({ children, ...props }) => (
  <button type="button" className="button ripple primary" {...props}>
    {children}
  </button>
);

export default GameAction;
