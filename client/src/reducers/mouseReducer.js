const createReducer = require('./createReducer');

module.exports = createReducer({
  inWorkspace: undefined,
  dx: undefined,
  dy: undefined,
  isDown: undefined,
  isUp: undefined,
  x: undefined,
  y: undefined
}, {
  MOUSE_IN_WORKSPACE: (state, {payload}) => ({
    ...state,
    inWorkspace: payload.inWorkspace
  }),
  MOVE_MOUSE: (state, {payload}) => ({
    ...state,
    x: payload.x,
    y: payload.y,
    dx: payload.x - state.x,
    dy: payload.y - state.y
  }),
  DEPRESS_MOUSE: state => ({
    ...state,
    isDown: true,
    isUp: false
  }),
  RELEASE_MOUSE: state => ({
    ...state,
    isDown: false,
    isUp: true
  })
});
