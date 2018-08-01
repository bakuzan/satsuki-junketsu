import classNames from 'classnames';
import React from 'react';
import toaster from 'utils/toaster';

import './toaster.css';

class Toaster extends React.Component {
  constructor() {
    super();
    this.state = {
      stack: Array(0)
    };
    this.timer = null;

    toaster.register(this);
  }

  removeColdToast() {
    return this.state.stack.filter((x) => x.time > Date.now() - 3000);
  }

  removeToast(time) {
    const warmToast = this.removeColdToast();
    const remainingToast = warmToast.filter((x) => x.time !== time);
    this.setState({ stack: remainingToast });
  }

  eatToast() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.removeToast(), 3000);
  }

  popToast(toast) {
    this.setState({ stack: [...this.state.stack, toast] });
    this.eatToast();
  }

  render() {
    const list = this.state.stack || Array(0);

    return (
      <div className={classNames('toaster')}>
        {list.map((item) => {
          const removeToast = () => this.removeToast(item.time);
          return (
            <span
              key={item.time}
              role="button"
              tabIndex="0"
              className={classNames('toast', item.type.toLowerCase())}
              onClick={removeToast}
              onKeyDown={removeToast}
            >
              <span className={classNames('toast__title')}>{item.title}</span>
              <span className={classNames('toast__message')}>
                {item.message}
              </span>
            </span>
          );
        })}
      </div>
    );
  }
}

export default Toaster;
