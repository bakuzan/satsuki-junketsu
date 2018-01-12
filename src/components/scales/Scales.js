import React, { Component } from 'react';
import './scales.css';

class Scales extends Component {
  renderScale(array) {
    return array.map(item => <div key={item}>{item}</div>);
  }

  render() {
    const files = this.renderScale(this.props.files);
    const ranks = this.renderScale(this.props.ranks);

    return (
      <span className="scales">
        <span className="scale file top">{files}</span>
        <span className="scale file bottom">{files}</span>
        <span className="scale rank left">{ranks}</span>
        <span className="scale rank right">{ranks}</span>
      </span>
    );
  }
}

export default Scales;
