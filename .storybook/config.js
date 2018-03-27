import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories');
  require('../src/stories/pieceSvgs');
}

configure(loadStories, module);
