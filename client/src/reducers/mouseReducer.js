const createReducer = require('./createReducer');

module.exports = createReducer({}, {
  'MOVE_MOUSE': (state, action) => ({
    ...state,
    ...action.payload,
    dx: state.x - action.payload.x,
    dy: state.y - action.payload.y
  }),
  'DEPRESS_MOUSE': state => ({
    ...state,
    isDown: true,
    isUp: false
  }),
  'RELEASE_MOUSE': state => ({
    ...state,
    isDown: false,
    isUp: true
  }),
});
