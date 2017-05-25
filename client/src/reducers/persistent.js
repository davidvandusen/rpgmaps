function persistent(reducer, options = {}) {
  let initialState;
  const {
    key,
    deserialize,
    serialize
  } = {
    key: 'redux',
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    ...options
  };
  const str = localStorage.getItem(key);
  if (str) {
    try {
      initialState = deserialize(str);
    } catch (err) {
      console.warn(`Failed to load ${key} from localStorage`);
    }
  }
  if (!initialState) {
    initialState = reducer(undefined, {});
  }
  return (state = initialState, action) => {
    const nextState = reducer(state, action);
    if (nextState !== state) {
      try {
        const str = serialize(nextState);
        localStorage.setItem(key, str);
      } catch (err) {
        console.warn(`Failed to save ${key} to localStorage`);
      }
    }
    return nextState;
  };
}

module.exports = persistent;
