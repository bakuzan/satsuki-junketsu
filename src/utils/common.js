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

export const generateUniqueId = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

export const padNumber = (n, width, z = 0) => {
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

export const formatDate = d => {
  if (!d) return '';
  const date = new Date(d);
  return `${date.getFullYear()}-${padNumber(
    date.getMonth() + 1,
    2
  )}-${padNumber(date.getDate(), 2)}`;
};
