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

const queenStyleBlackCircles = {
  fill: '#000000',
  stroke: 'none'
};

const queenStyleBlackSpikes = {
  strokeLinecap: 'butt',
  stroke: '#000000'
};

const queenStylePath1 = {
  strokeLinecap: 'butt'
};

const queenStyleBlackBaseline = {
  fill: 'none',
  stroke: '#000000',
  strokeLinecap: 'butt'
};

const queenStyleBlackCrownlines = {
  fill: 'none',
  stroke: '#ffffff'
};

const queenStyleWhitePath2 = {
  fill: 'none'
};

const Queen = ({ size, styleSettings }) => {
  if (styleSettings.isWhite)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={size}
        height={size}
      >
        <g style={{ ...queenStyleMainBody, ...styleSettings.mainBody }}>
          <path
            d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
            transform="translate(-1,-1)"
          />
          <path
            d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
            transform="translate(15.5,-5.5)"
          />
          <path
            d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
            transform="translate(32,-1)"
          />
          <path
            d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
            transform="translate(7,-4.5)"
          />
          <path
            d="M 9 13 A 2 2 0 1 1  5,13 A 2 2 0 1 1  9 13 z"
            transform="translate(24,-4)"
          />
          <path
            d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38,14 L 31,25 L 31,11 L 25.5,24.5 L 22.5,9.5 L 19.5,24.5 L 14,10.5 L 14,25 L 7,14 L 9,26 z "
            style={queenStylePath1}
          />
          <path
            d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z "
            style={queenStylePath1}
          />
          <path
            d="M 11.5,30 C 15,29 30,29 33.5,30"
            style={queenStyleWhitePath2}
          />
          <path
            d="M 12,33.5 C 18,32.5 27,32.5 33,33.5"
            style={queenStyleWhitePath2}
          />
        </g>
      </svg>
    );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={size}
      height={size}
    >
      <g style={queenStyleMainBody}>
        <g style={queenStyleBlackCircles}>
          <circle cx="6" cy="12" r="2.75" />
          <circle cx="14" cy="9" r="2.75" />
          <circle cx="22.5" cy="8" r="2.75" />
          <circle cx="31" cy="9" r="2.75" />
          <circle cx="39" cy="12" r="2.75" />
        </g>
        <path
          d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"
          style={queenStyleBlackSpikes}
        />
        <path
          d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"
          style={queenStylePath1}
        />
        <path
          d="M 11,38.5 A 35,35 1 0 0 34,38.5"
          style={queenStyleBlackBaseline}
        />
        <path
          d="M 11,29 A 35,35 1 0 1 34,29"
          style={queenStyleBlackCrownlines}
        />
        <path d="M 12.5,31.5 L 32.5,31.5" style={queenStyleBlackCrownlines} />
        <path
          d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"
          style={queenStyleBlackCrownlines}
        />
        <path
          d="M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"
          style={queenStyleBlackCrownlines}
        />
      </g>
    </svg>
  );
};

export default withColour(Queen);
