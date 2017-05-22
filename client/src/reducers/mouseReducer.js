const createReducer = require('./createReducer');

module.exports = createReducer({}, {
  MOUSE_IN_WORKSPACE: (state, action) => ({...state, inWorkspace: action.payload.inWorkspace}),
  MOVE_MOUSE: (state, action) => ({
    ...state,
    ...action.payload,
    dx: action.payload.x - state.x,
    dy: action.payload.y - state.y
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
  }),
});
