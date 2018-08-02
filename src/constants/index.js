import { Paths } from './paths';
import Strings from './strings';
import * as board from './board';

const Constants = {
  Paths,
  Strings,
  themes: [
    { name: 'Junketsu', class: 'theme-one' },
    { name: 'Senketsu', class: 'theme-two' }
  ],
  boardThemes: [
    { name: 'Standard', class: 'board-one' },
    { name: 'Desert', class: 'board-two' },
    { name: 'Forest', class: 'board-three' }
  ],
  ...board
};

export default Constants;
