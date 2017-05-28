const createReducer = require('./createReducer');

module.exports = createReducer({
  controlsHeight: undefined,
  menuOpen: undefined,
  roomName: undefined,
  draggedTokenId: undefined
}, {
  SET_CONTROLS_HEIGHT: (state, {payload}) => ({
    ...state,
    controlsHeight: payload.controlsHeight
  }),
  SET_MENU_OPEN: (state, {payload}) => ({
    ...state,
    menuOpen: payload.menuOpen
  }),
  SET_ROOM_NAME: (state, {payload}) => ({
    ...state,
    roomName: payload.roomName
  }),
  SET_DRAGGED_TOKEN_ID: (state, {payload}) => ({
    ...state,
    draggedTokenId: payload._id
  })
});
