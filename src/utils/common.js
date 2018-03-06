import Strings from 'constants/strings';

export const getUserSettings = () =>
  JSON.parse(localStorage.getItem(Strings.localUserSettings)) || null;

export const persistUserSettings = settingUpdate => {
  const settings = getUserSettings();
  const updated = { ...settings, ...settingUpdate };
  localStorage.setItem(Strings.localUserSettings, JSON.stringify(updated));
  return updated;
};

export const updateArrayPreservingOrder = (arr, i, o) => [
  ...arr.slice(0, i),
  { ...arr[i], ...o },
  ...arr.slice(i + 1)
];

export const reverseArray = arr => arr.slice(0).reverse();

export const capitalise = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join('').toLowerCase() : rest.join(''));

export const compose = (...fns) =>
  fns.reduce((f, g) => (...args) => f(g(...args)));

export function curry(uncurried) {
  const parameters = Array.prototype.slice.call(arguments, 1);
  return function() {
    return uncurried.apply(
      this,
      parameters.concat(Array.prototype.slice.call(arguments, 0))
    );
  };
}
