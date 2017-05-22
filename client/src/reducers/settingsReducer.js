const createReducer = require('./createReducer');

module.exports = createReducer({}, {
  CYCLE_TERRAIN: state => ({
    ...state,
    terrain: state.terrain === state.terrains.length - 1 ? 0 : state.terrain + 1
  }),
  CYCLE_TERRAIN_REVERSE: state => ({
    ...state,
    terrain: state.terrain === 0 ? state.terrains.length - 1 : state.terrain - 1
  }),
  SET_TERRAIN: (state, action) => ({
    ...state,
    terrain: action.payload.index
  }),
  SET_TOOL: (state, action) => ({
    ...state,
    tool: action.payload.tool
  }),
  SET_BRUSH_SIZE: (state, action) => ({
    ...state,
    brush: {
      ...state.brush,
      size: Math.min(128, Math.max(1, action.payload.size))
    }
  }),
  DECREMENT_BRUSH_SIZE: state => ({
    ...state,
    brush: {
      ...state.brush,
      size: Math.max(1, state.brush.size - 1)
    }
  }),
  INCREMENT_BRUSH_SIZE: state => ({
    ...state,
    brush: {
      ...state.brush,
      size: Math.min(128, state.brush.size + 1)
    }
  })
});
