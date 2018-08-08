import classNames from 'classnames';
import React from 'react';

import './appInformation.css';

const resolveENVVariable = (str) => (str || '').trim();

class AppInformation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };

    this.handleHovered = this.handleHovered.bind(this);
  }

  handleHovered(hovered) {
    return () => this.setState({ hovered });
  }

  render() {
    const branch = resolveENVVariable(process.env.REACT_APP_BRANCH);
    const version = resolveENVVariable(process.env.REACT_APP_VERSION);

    return (
      <div
        className={classNames('app-information')}
        onMouseEnter={this.handleHovered(true)}
        onMouseLeave={this.handleHovered(false)}
        aria-label={`Branch ${branch}, version ${version}`}
      >
        <div
          className={classNames('app-information__detail', {
            'app-information__detail--visible': this.state.hovered
          })}
        >
          Branch: {branch}
          <br />
          Version: {version}
        </div>
      </div>
    );
  }
}

export default AppInformation;
