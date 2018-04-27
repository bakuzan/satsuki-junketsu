import PropTypes from 'prop-types';
import React from 'react';

const MAX_WIDTH_FALLBACK = '525px';

const AccountFor = {
  header: 50,
  actions: 45,
  status: 52,
  playback: 62
};

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
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    window.removeEventListener('resize', this.onResize);
  }

  onResize(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const el = this.wrappedComponent.current;
      const rawValue = Math.min(el.clientHeight, el.clientWidth);
      const value = Object.keys(AccountFor).reduce(
        (p, c) => p - AccountFor[c],
        rawValue
      );
      // const { width, height } = el.getBoundingClientRect();
      // console.group("resize")
      // console.log("client > ", el.clientWidth, el.clientHeight)
      // console.log("offset > ", el.offsetWidth, el.offsetHeight)
      // console.log("bounding > ", width, height)
      // console.groupEnd()
      this.setState({
        width: `${value}px`,
        height: `${value}px`
      });
    }, 200);
  }

  render() {
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
