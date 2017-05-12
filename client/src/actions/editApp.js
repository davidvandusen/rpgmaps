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
  }
}

function moveMouse(x, y) {
  return {
    type: 'MOVE_MOUSE',
    payload: {
      mouse: {
        x,
        y
      }
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

function beginCaptureStroke() {
  return {
    type: 'BEGIN_CAPTURE_STROKE'
  };
}

function endCaptureStroke() {
  return {
    type: 'END_CAPTURE_STROKE'
  };
}

exports.bindGlobalEvents = store => {
  window.addEventListener('resize', throttle(() => store.dispatch(resizeApp(window.innerWidth, window.innerHeight)), 100));
  window.addEventListener('wheel', throttle(event => store.dispatch(scaleSurface(event.deltaY / 100, event.clientX, event.clientY)), 16));
  document.addEventListener('mousemove', throttle(event => store.dispatch(moveMouse(event.clientX, event.clientY)), 16));
  document.body.addEventListener('mouseleave', event => store.dispatch(moveMouse(undefined, undefined)));
  document.addEventListener('mousedown', () => store.dispatch(beginCaptureStroke()));
  document.addEventListener('mouseup', () => store.dispatch(endCaptureStroke()));
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
