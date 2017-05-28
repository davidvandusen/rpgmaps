const makeActionCreator = require('./makeActionCreator');

const setControlsHeight = makeActionCreator('SET_CONTROLS_HEIGHT', 'controlsHeight');
exports.setControlsHeight = setControlsHeight;

const openMenu = makeActionCreator('SET_MENU_OPEN', 'menuOpen');
exports.openMenu = openMenu;

const closeMenu = openMenu;
exports.closeMenu = closeMenu;

const toggleMenu = (menuOpen) => (dispatch, getState) => {
  if (getState().ui.controls.menuOpen === menuOpen) {
    dispatch(closeMenu());
  } else {
    dispatch(openMenu(menuOpen));
  }
};
exports.toggleMenu = toggleMenu;

const setRoomName = makeActionCreator('SET_ROOM_NAME', 'roomName');
exports.setRoomName = setRoomName;

const setDraggedTokenId = makeActionCreator('SET_DRAGGED_TOKEN_ID', '_id');
exports.grabToken = setDraggedTokenId;
exports.releaseToken = setDraggedTokenId;
