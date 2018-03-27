import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from '@storybook/react/demo';
import PieceSVGS from 'components/piece/pieceSvgs/index';

storiesOf('Piece SVGS', module)
  .add('Bishop - black', () => <PieceSVGS.Bishop colour={'black'} />)
  .add('Bishop - white', () => <PieceSVGS.Bishop colour={'white'} />)
  .add('King - black', () => <PieceSVGS.King colour={'black'} />)
  .add('King - white', () => <PieceSVGS.King colour={'white'} />)
  .add('Knight - black', () => <PieceSVGS.Knight colour={'black'} />)
  .add('Knight - white', () => <PieceSVGS.Knight colour={'white'} />)
  .add('Pawn - black', () => <PieceSVGS.Pawn colour={'black'} />)
  .add('Pawn - white', () => <PieceSVGS.Pawn colour={'white'} />)
  .add('Queen - black', () => <PieceSVGS.Queen colour={'black'} />)
  .add('Queen - white', () => <PieceSVGS.Queen colour={'white'} />)
  .add('Rook - black', () => <PieceSVGS.Rook colour={'black'} />)
  .add('Rook - white', () => <PieceSVGS.Rook colour={'white'} />);
