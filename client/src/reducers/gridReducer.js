const createReducer = require('./createReducer');

module.exports = createReducer({
  lineColor: 'black',
  lineWidth: 0.05,
  opacity: 0.75,
  spacing: 5,
  type: 'pointy-top-hex'
}, {
  SET_GRID_LINE_COLOR: (state, {payload}) => ({
    ...state,
    lineColor: payload.lineColor
  }),
  SET_GRID_LINE_WIDTH: (state, {payload}) => ({
    ...state,
    lineWidth: payload.lineWidth
  }),
  SET_GRID_OPACITY: (state, {payload}) => ({
    ...state,
    opacity: payload.opacity
  }),
  SET_GRID_SPACING: (state, {payload}) => ({
    ...state,
    spacing: payload.spacing
  }),
  SET_GRID_TYPE: (state, {payload}) => ({
    ...state,
    type: payload.type
  })
});
