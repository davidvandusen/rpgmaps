const makeActionCreator = require('./makeActionCreator');

const setControlsHeight = makeActionCreator('SET_CONTROLS_HEIGHT', 'controlsHeight');
exports.setControlsHeight = setControlsHeight;

const openMenu = makeActionCreator('SET_MENU_OPEN', 'menuOpen');
exports.openMenu = openMenu;

const closeMenu = () => openMenu();
exports.closeMenu = closeMenu;

const toggleMenu = (menuOpen) => (dispatch, getState) => {
  if (getState().ui.controls.menuOpen === menuOpen) {
    dispatch(closeMenu());
  } else {
    dispatch(openMenu(menuOpen));
  }
};
exports.toggleMenu = toggleMenu;
