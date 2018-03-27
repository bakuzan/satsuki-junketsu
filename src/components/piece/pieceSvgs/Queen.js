import React from 'react';

import withColour from './PieceSvgWrapper';

const queenStyleMainBody = {
  opacity: 1,
  fill: '#000000',
  fillOpacity: 1,
  fillRule: 'evenodd',
  stroke: '#000000',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeMiterlimit: 4,
  strokeDasharray: 'none',
  strokeOpacity: 1
};

const queenStyleCircles = {
  fill: '#000000',
  stroke: 'none'
};

const queenStyleSpikes = {
  strokeLinecap: 'butt',
  stroke: '#000000'
};

const queenStylePath2 = {
  strokeLinecap: 'butt'
};

const queenStyleBaseline = {
  fill: 'none',
  stroke: '#000000',
  strokeLinecap: 'butt'
};

const queenStyleCrownlines = {
  fill: 'none',
  stroke: '#ffffff'
};

const Queen = ({ size, styleSettings }) => {
  const mainBody = { ...queenStyleMainBody, ...styleSettings.mainBody };
  const circles = { ...queenStyleCircles, ...styleSettings.circles };
  const spikes = { ...queenStyleSpikes, ...styleSettings.spikes };
  const baseline = { ...queenStyleBaseline, ...styleSettings.baseline };
  const crownLines = { ...queenStyleCrownlines, ...styleSettings.crownLines };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={size}
      height={size}
    >
      <g style={mainBody}>
        <g style={circles}>
          <circle cx="6" cy="12" r="2.75" />
          <circle cx="14" cy="9" r="2.75" />
          <circle cx="22.5" cy="8" r="2.75" />
          <circle cx="31" cy="9" r="2.75" />
          <circle cx="39" cy="12" r="2.75" />
        </g>
        <path
          d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"
          style={spikes}
        />
        <path
          d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"
          style={queenStylePath2}
        />
        <path d="M 11,38.5 A 35,35 1 0 0 34,38.5" style={baseline} />
        <path d="M 11,29 A 35,35 1 0 1 34,29" style={crownLines} />
        <path d="M 12.5,31.5 L 32.5,31.5" style={crownLines} />
        <path d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5" style={crownLines} />
        <path d="M 10.5,37.5 A 35,35 1 0 0 34.5,37.5" style={crownLines} />
      </g>
    </svg>
  );
};

export default withColour(Queen);
