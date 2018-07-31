import Strings from 'constants/strings';

const getObjectFromLocalStorageByProperty = (property) =>
  JSON.parse(localStorage.getItem(property)) || null;

const persistObjectToLocalStorage = (property) => (newValues) => {
  const values = getObjectFromLocalStorageByProperty(property) || {};
  const updated = { ...values, ...newValues };
  localStorage.setItem(property, JSON.stringify(updated));
  return updated;
};

export const getUserSettings = () =>
  getObjectFromLocalStorageByProperty(Strings.localUserSettings);

export const persistUserSettings = persistObjectToLocalStorage(
  Strings.localUserSettings
);

export const getSavedGame = () =>
  getObjectFromLocalStorageByProperty(Strings.localGameState);

export const persistChessGame = persistObjectToLocalStorage(
  Strings.localGameState
);

export const updateArrayPreservingOrder = (arr, i, o) => [
  ...arr.slice(0, i),
  { ...arr[i], ...o },
  ...arr.slice(i + 1)
];

export const reverseArray = (arr) => arr.slice(0).reverse();

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
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

export const padNumber = (n, width, z = 0) => {
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

export const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return `${date.getFullYear()}-${padNumber(
    date.getMonth() + 1,
    2
  )}-${padNumber(date.getDate(), 2)}`;
};

const isTypeOf = (t) => (v) => typeof v === t;
export const isObject = isTypeOf('object');
export const isArray = (v) => v instanceof Array;

export const objectsAreEqual = (o1, o2) => {
  if (!isObject(o1) || !isObject(o2)) return o1 === o2;
  return Object.keys(o1).every((k) => {
    const one = o1[k];
    const two = o2[k];
    return isArray(one)
      ? one
          .map((t, i) => objectsAreEqual(one[i], two[i]))
          .every((b) => b === true)
      : one === two;
  });
};

export const getMoveWithBestScore = (o1, o2) => {
  const { moveResults: m1 } = o1;
  const { moveResults: m2 } = o2;

  const v1 = [...m1.values()];
  const v2 = [...m2.values()];

  const max1 = Math.max(...v1);
  const max2 = Math.max(...v2);

  return max1 >= max2 ? o1 : o2;
};

export const getKeyForMaxValue = (pairs) =>
  [...pairs.keys()].reduce(
    (pk, ck) => (pairs.get(pk) >= pairs.get(ck) ? pk : ck)
  );

const mirrorMatrix = (arr) => arr.map((a) => a.reverse());
const splitArray = (arr, len = 8) => {
  const chunks = [];
  let i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
};

export const splitMirrorAndJoin = compose(
  (arr) => arr.reduce((a, b) => [...a, ...b]),
  mirrorMatrix,
  splitArray
);
