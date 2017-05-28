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
  window.addEventListener('wheel', throttle(event => dispatch(zoomWorkspace(event.deltaY / 100, event.clientX, event.clientY, true)), 16), {passive: true});
  window.addEventListener('mousemove', throttle(event => dispatch(moveMouse(event.clientX, event.clientY)), 16), {passive: true});
  window.addEventListener('mousedown', () => dispatch(depressMouse()));
  window.addEventListener('mouseup', () => dispatch(releaseMouse()));
  window.addEventListener('keydown', makeKeyHandler(keymap.down));
  window.addEventListener('keyup', makeKeyHandler(keymap.up));
};
