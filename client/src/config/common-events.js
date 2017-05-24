const {throttle} = require('lodash');
const {resizeWorkspace, zoomWorkspace} = require('../actions/workspaceActions');
const {moveMouse, depressMouse, releaseMouse} = require('../actions/mouseActions');

function makeKeyHandler(handlers) {
  return event => {
    const fn = handlers[event.key];
    if (typeof fn === 'function') fn(event);
  };
}

module.exports = (dispatch, keymap) => {
  window.addEventListener('resize', throttle(() => dispatch(resizeWorkspace(window.innerWidth, window.innerHeight)), 100), {passive: true});
  document.addEventListener('wheel', throttle(event => dispatch(zoomWorkspace(event.deltaY / 100, event.clientX, event.clientY, true)), 16), {passive: true});
  document.addEventListener('mousemove', throttle(event => dispatch(moveMouse(event.clientX, event.clientY)), 16), {passive: true});
  document.addEventListener('mousedown', () => dispatch(depressMouse()));
  document.addEventListener('mouseup', () => dispatch(releaseMouse()));
  document.addEventListener('keydown', makeKeyHandler(keymap.down));
  document.addEventListener('keyup', makeKeyHandler(keymap.up));
};
