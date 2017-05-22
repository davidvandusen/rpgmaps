const {throttle} = require('lodash');

function makeKeyHandler(handlers) {
  return event => {
    const fn = handlers[event.key];
    if (typeof fn === 'function') fn(event);
  };
}

module.exports = (dispatch, actions, keymap) => {
  window.addEventListener('resize', throttle(() => dispatch(actions.resizeApp(window.innerWidth, window.innerHeight)), 100), {passive: true});
  document.addEventListener('wheel', throttle(event => dispatch(actions.scaleSurface(event.deltaY / 100, event.clientX, event.clientY, true)), 16), {passive: true});
  document.addEventListener('mousemove', throttle(event => dispatch(actions.moveMouse(event.clientX, event.clientY)), 16), {passive: true});
  document.addEventListener('mousedown', () => dispatch(actions.depressMouse()));
  document.addEventListener('mouseup', () => dispatch(actions.releaseMouse()));
  document.addEventListener('keydown', makeKeyHandler(keymap.down));
  document.addEventListener('keyup', makeKeyHandler(keymap.up));
};
