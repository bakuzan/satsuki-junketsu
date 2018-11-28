import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Portal from 'components/Portal';
import SelectBox from 'components/selectBox/SelectBox';
import Tickbox from 'components/tickbox/Tickbox';

import { setApplicationTheme, setBoardTheme } from 'actions/theme';
import { toggleReverseBoard } from 'actions/board';
import Constants from 'constants/index';
import './appSettings.scss';

const themeMapper = (theme) => ({
  text: theme.name,
  value: theme.class
});
const appThemes = Constants.themes.map(themeMapper);
const boardThemes = Constants.boardThemes.map(themeMapper);

const applyThemeToBody = (theme) => (document.body.className = theme);

class AppSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false
    };

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleCloseAppSettings = this.handleCloseAppSettings.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  handleDropdownChange(onChange) {
    return (e) => {
      onChange(e.target.value);
      this.handleCloseAppSettings();
    };
  }

  handleCloseAppSettings() {
    this.setState({ isDropdownOpen: false });
  }

  toggleDropdown() {
    this.setState((prev) => ({ isDropdownOpen: !prev.isDropdownOpen }));
  }

  render() {
    const {
      appTheme,
      boardTheme,
      setApplicationTheme,
      setBoardTheme,
      reverseBoard,
      toggleReverseBoard
    } = this.props;
    applyThemeToBody(appTheme);

    return (
      <div id="app-settings">
        <input
          type="checkbox"
          value={this.state.isDropdownOpen}
          id="app-settings-toggler"
          onChange={this.toggleDropdown}
        />
        <label
          icon="&#x2699;"
          htmlFor="app-settings-toggler"
          title="App settings"
        />
        {this.state.isDropdownOpen && (
          <Portal targetSelector="main">
            <div
              id="app-settings-backdrop"
              role="button"
              onClick={this.handleCloseAppSettings}
            />
            <ul id="app-settings-menu" className="dropdown-menu" role="menu">
              <li className="dropdown-arrow" />
              <li>
                <SelectBox
                  name="appTheme"
                  text="App Theme"
                  value={appTheme}
                  options={appThemes}
                  onSelect={this.handleDropdownChange(setApplicationTheme)}
                />
              </li>
              <li>
                <SelectBox
                  name="boardTheme"
                  text="Board Theme"
                  value={boardTheme}
                  options={boardThemes}
                  onSelect={this.handleDropdownChange(setBoardTheme)}
                />
              </li>
              <li>
                <Tickbox
                  name="reverseBoard"
                  text="Flip board on move"
                  checked={reverseBoard}
                  onChange={toggleReverseBoard}
                />
              </li>
            </ul>
          </Portal>
        )}
      </div>
    );
  }
}

AppSettings.propTypes = {
  appTheme: PropTypes.string.isRequired,
  boardTheme: PropTypes.string.isRequired,
  setApplicationTheme: PropTypes.func.isRequired,
  setBoardTheme: PropTypes.func.isRequired,
  reverseBoard: PropTypes.bool.isRequired,
  toggleReverseBoard: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  appTheme: state.theme.app,
  boardTheme: state.theme.board,
  reverseBoard: state.board.reverseBoard
});

const mapDispatchToProps = {
  setApplicationTheme,
  setBoardTheme,
  toggleReverseBoard
};

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);
