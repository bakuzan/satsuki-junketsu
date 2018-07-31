const options = Object.freeze([
  { id: 1, text: 'vs Computer (You as White)' },
  { id: 2, text: 'vs Computer (You as Black)' },
  { id: 3, text: 'vs Player' }
]);

export default options;

export const NewGameOptions = Object.freeze(
  options.reduce((p, c) => {
    const key = c.text.replace(/\(|\)| |as/g, '');

    return {
      ...p,
      [key]: c.id
    };
  }, {})
);
