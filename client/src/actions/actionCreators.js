const makeActionCreator = require('./makeActionCreator');
const mapDataFactory = require('../common/mapDataFactory');

exports.cycleTerrain = makeActionCreator('CYCLE_TERRAIN');
exports.cycleTerrainReverse = makeActionCreator('CYCLE_TERRAIN_REVERSE');
exports.resizeApp = makeActionCreator('RESIZE_APP', 'width', 'height');
exports.scaleToFit = makeActionCreator('SCALE_TO_FIT');
exports.scaleSurface = makeActionCreator('SCALE_SURFACE', 'delta', 'x', 'y');
exports.depressMouse = makeActionCreator('DEPRESS_MOUSE');
exports.releaseMouse = makeActionCreator('RELEASE_MOUSE');
exports.moveMouse = makeActionCreator('MOVE_MOUSE', 'x', 'y');
exports.incrementBrushSize = makeActionCreator('INCREMENT_BRUSH_SIZE');
exports.decrementBrushSize = makeActionCreator('DECREMENT_BRUSH_SIZE');
exports.centerSurface = makeActionCreator('CENTER_SURFACE');
exports.setTool = makeActionCreator('SET_TOOL', 'tool');

const paintInput = makeActionCreator('PAINT_INPUT', 'indices');
const setMapData = makeActionCreator('SET_MAP_DATA', 'mapData');

exports.paintInput = function (indices) {
  return (dispatch, getState) => {
    dispatch(paintInput(indices));
    mapDataFactory(getState().settings.terrains).fromImageData(getState().graphics.inputBuffer).then(mapData => {
      dispatch(setMapData(mapData));
    });
  };
};
