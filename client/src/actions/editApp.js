const mapDataFactory = require('../common/mapDataFactory');

function cycleTerrain() {
  return {
    type: 'CYCLE_TERRAIN'
  };
}
exports.cycleTerrain = cycleTerrain;

function cycleTerrainReverse() {
  return {
    type: 'CYCLE_TERRAIN_REVERSE'
  };
}
exports.cycleTerrainReverse = cycleTerrainReverse;

function resizeApp(width, height) {
  return {
    type: 'RESIZE_APP',
    payload: {
      width,
      height
    }
  };
}
exports.resizeApp = resizeApp;

function scaleToFit() {
  return {
    type: 'SCALE_TO_FIT'
  };
}
exports.scaleToFit = scaleToFit;

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
exports.scaleSurface = scaleSurface;

function depressMouse() {
  return {
    type: 'DEPRESS_MOUSE'
  };
}
exports.depressMouse = depressMouse;

function releaseMouse() {
  return {
    type: 'RELEASE_MOUSE'
  };
}
exports.releaseMouse = releaseMouse;

function moveMouse(x, y) {
  return {
    type: 'MOVE_MOUSE',
    payload: {
      x,
      y
    }
  };
}
exports.moveMouse = moveMouse;

function incrementBrushSize() {
  return {
    type: 'INCREMENT_BRUSH_SIZE'
  };
}
exports.incrementBrushSize = incrementBrushSize;

function decrementBrushSize() {
  return {
    type: 'DECREMENT_BRUSH_SIZE'
  };
}
exports.decrementBrushSize = decrementBrushSize;

function centerSurface() {
  return {
    type: 'CENTER_SURFACE'
  };
}
exports.centerSurface = centerSurface;

function setTool(tool) {
  return {
    type: 'SET_TOOL',
    payload: {
      tool
    }
  };
}
exports.setTool = setTool;

function paintInput(indices) {
  return (dispatch, getState) => {
    dispatch({
      type: 'PAINT_INPUT',
      payload: {indices}
    });
    mapDataFactory(getState().terrains).fromImageData(getState().inputImageData).then(mapData => {
      dispatch({
        type: 'SET_MAP_DATA',
        payload: {mapData}
      });
    });
  }
}
exports.paintInput = paintInput;
