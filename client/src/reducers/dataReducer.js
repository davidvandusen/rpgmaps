const createReducer = require('./createReducer');

module.exports = createReducer({
  mapData: undefined,
  publishedMap: undefined
}, {
  SET_MAP_DATA: (state, {payload}) => ({
    ...state,
    mapData: payload.mapData
  }),
  SET_PUBLISHED_MAP: (state, {payload}) => ({
    ...state,
    publishedMap: payload.publishedMap
  })
});
