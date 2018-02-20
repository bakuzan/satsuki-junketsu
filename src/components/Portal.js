import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

class Portal extends React.Component {
  constructor(props) {
    super(props);

    this.el = document.createElement(props.parentTag);
    this.getTargetNode = () => document.querySelector(props.targetSelector);
  }

  componentDidMount() {
    const targetNode = this.getTargetNode();
    targetNode.appendChild(this.el);
  }

  componentWillUnmount() {
    const targetNode = this.getTargetNode();
    if (targetNode) targetNode.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

Portal.defaultProps = {
  parentTag: 'div'
};

Portal.propTypes = {
  parentTag: PropTypes.string,
  targetSelector: PropTypes.string.isRequired
};

export default Portal;
