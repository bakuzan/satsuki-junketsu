import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import AppSettings from 'containers/appSettings/AppSettings';
import SvgLogo from '../svgLogo/SVGLogo.js';
import { Paths } from 'constants/paths';
import './header.css';

class Header extends Component {
  render() {
    return (
      <nav className="satsuki-header center-contents">
        <NavLink className="ripple" id="satsuki-svg" to={Paths.base}>
          <SvgLogo text="Satsuki Junketsu" />
        </NavLink>
        <h1>SATSUKI JUNKETSU</h1>
        <div id="navigation-links">
          <div className="flex-right center-vertically">
            <AppSettings />
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
