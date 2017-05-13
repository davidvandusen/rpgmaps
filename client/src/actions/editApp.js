const {throttle} = require('lodash');

function resizeApp(width, height) {
  return {
    type: 'RESIZE_APP',
    payload: {
      width,
      height
    }
  };
}

function scaleSurface(delta, x, y) {
  return {
    type: 'SCALE_SURFACE',
    payload: {
      delta,
      x,
      y
    }
  };
}

function depressMouse() {
  return {
    type: 'DEPRESS_MOUSE'
  };
}

function releaseMouse() {
  return {
    type: 'RELEASE_MOUSE'
  };
}

function moveMouse(x, y) {
  return {
    type: 'MOVE_MOUSE',
    payload: {
      x,
      y
    }
  };
}

function incrementBrushSize() {
  return {
    type: 'INCREMENT_BRUSH_SIZE'
  };
}

function decrementBrushSize() {
  return {
    type: 'DECREMENT_BRUSH_SIZE'
  };
}

function centerSurface() {
  return {
    type: 'CENTER_SURFACE'
  };
}

function setTool(tool) {
  return {
    type: 'SET_TOOL',
    payload: {
      tool
    }
  };
}

exports.bindGlobalEvents = store => {
  window.addEventListener('resize', throttle(() => store.dispatch(resizeApp(window.innerWidth, window.innerHeight)), 100));
  window.addEventListener('wheel', throttle(event => store.dispatch(scaleSurface(event.deltaY / 100, event.clientX, event.clientY)), 16), {passive: true});
  document.addEventListener('mousemove', throttle(event => store.dispatch(moveMouse(event.clientX, event.clientY)), 16));
  document.addEventListener('mousedown', () => store.dispatch(depressMouse()));
  document.addEventListener('mouseup', () => store.dispatch(releaseMouse()));
  document.addEventListener('dblclick', () => store.dispatch(centerSurface()));
  document.addEventListener('keydown', event => {
    switch (event.key) {
      case ' ':
        store.dispatch(setTool('DRAG'));
        break;
    }
  });
  document.addEventListener('keyup', event => {
    switch (event.key) {
      case ' ':
        store.dispatch(setTool('BRUSH'));
        break;
    }
  });
  document.addEventListener('keypress', event => {
    switch (event.key) {
      case ']':
        store.dispatch(incrementBrushSize());
        break;
      case '[':
        store.dispatch(decrementBrushSize());
        break;
    }
  });
};
