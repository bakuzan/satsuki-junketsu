import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { setApplicationTheme } from 'actions/theme';

import Constants from 'constants/index';
import './appSettings.css';

const applyThemeToBody = theme => (document.body.className = theme);

const AppSettings = ({ theme, setApplicationTheme }) => {
  const themes = Constants.themes.slice(0);
  applyThemeToBody(theme);

  return (
    <div id="app-settings">
      <button
        type="button"
        title="App settings"
        className="button-icon ripple"
        icon="&#x2699;"
      />
      <ul className="dropdown-menu" role="menu">
        <li className="dropdown-arrow" />
        <li className="button-group">
          {themes.map(item => (
            <button
              key={item.class}
              type="button"
              role="menuitem"
              className="button"
              onClick={() => setApplicationTheme(item.class)}
            >
              {item.name}
            </button>
          ))}
        </li>
      </ul>
    </div>
  );
};

AppSettings.propTypes = {
  theme: PropTypes.string.isRequired,
  setApplicationTheme: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  theme: state.theme.class
});

const mapDispatchToProps = {
  setApplicationTheme
};

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);
