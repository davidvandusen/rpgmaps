const createReducer = require('./createReducer');

module.exports = createReducer({
  width: undefined,
  height: undefined,
  scale: undefined,
  x: undefined,
  y: undefined
}, {
  RESIZE_WORKSPACE: (state, {payload}) => ({
    ...state,
    width: payload.width,
    height: payload.height
  }),
  SCALE_WORKSPACE: (state, {payload}) => ({
    ...state,
    scale: payload.scale
  }),
  TRANSLATE_WORKSPACE: (state, {payload}) => ({
    ...state,
    x: payload.x,
    y: payload.y
  }),
  TRANSFORM_WORKSPACE: (state, {payload}) => ({
    ...state,
    x: payload.x,
    y: payload.y,
    scale: payload.scale
  })
});
