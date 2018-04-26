import PropTypes from 'prop-types';
import React from 'react';

const MAX_WIDTH_FALLBACK = '525px';

export default class MaintainAspectRatio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: MAX_WIDTH_FALLBACK,
      height: MAX_WIDTH_FALLBACK
    };
    this.wrappedComponent = React.createRef();

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    console.log('M.A.R MOUNT >', this.wrappedComponent);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    window.removeEventListener('resize', this.onResize);
  }

  onResize(e) {
    clearTimeout(this.timer);
    console.log('resize', this.wrappedComponent);
    this.timer = setTimeout(() => {
      console.log('update', this.wrappedComponent);
      const el = this.wrappedComponent.current;
      const value = Math.min(el.clientHeight, el.clientWidth);
      console.log(el.clientHeight, el.clientWidth);
      this.setState({
        width: `${value}px`,
        height: `${value}px`
      });
    }, 500);
  }

  render() {
    console.log(
      'M.A.R RENDER > ',
      this.props,
      this.state,
      this.wrappedComponent
    );
    return this.props.children(this.wrappedComponent, this.state);
  }
}

MaintainAspectRatio.propTypes = {
  children: PropTypes.func.isRequired
};

export function withMaintainAspectRatio(WrappedComponent) {
  return class extends React.Component {
    render() {
      return (
        <MaintainAspectRatio>
          {(ref, values) => <WrappedComponent ref={ref} {...this.props} />}
        </MaintainAspectRatio>
      );
    }
  };
}
