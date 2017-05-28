const createReducer = require('./createReducer');

module.exports = createReducer([], {
  CREATE_TOKEN: (state, {payload}) => {
    return [
      ...state,
      {
        _id: Math.random(),
        name: payload.name,
        description: payload.description,
        x: payload.x,
        y: payload.y
      }
    ];
  },
  DELETE_TOKEN: (state, {payload}) => {
    const index = state.findIndex(token => token._id === payload._id);
    return [
      ...state.slice(0, index),
      ...state.slice(index + 1)
    ];
  },
  UPDATE_TOKEN: (state, {payload}) => {
    const index = state.findIndex(token => token._id === payload._id);
    return [
      ...state.slice(0, index),
      {
        _id: payload._id,
        name: payload.name,
        description: payload.description,
        x: payload.x,
        y: payload.y
      },
      ...state.slice(index + 1)
    ];
  }
});
