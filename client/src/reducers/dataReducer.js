const createReducer = require('./createReducer');

module.exports = createReducer({
  mapData: undefined
}, {
  SET_MAP_DATA: (state, {payload}) => ({
    ...state,
    mapData: payload.mapData
  })
});
