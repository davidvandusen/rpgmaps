const makeActionCreator = require('./makeActionCreator');
const mapDataFactory = require('./mapDataFactory');
const {renderImage, shouldImageUpdate} = require('./outputImageRenderer');

// Graphics actions
const setInputBuffer = makeActionCreator('SET_INPUT_BUFFER', 'inputBuffer');
const setOutputBuffer = makeActionCreator('SET_OUTPUT_BUFFER', 'outputBuffer');
const setPaintBuffer = makeActionCreator('SET_PAINT_BUFFER', 'paintBuffer');
const setMapData = makeActionCreator('SET_MAP_DATA', 'mapData');

// Mouse actions
exports.moveMouse = makeActionCreator('MOVE_MOUSE', 'x', 'y');
exports.depressMouse = makeActionCreator('DEPRESS_MOUSE');
const fadePaintBuffer = makeActionCreator('FADE_PAINT_BUFFER', 'amount');
const releaseMouse = makeActionCreator('RELEASE_MOUSE');
exports.releaseMouse = () => (dispatch, getState) => {
  dispatch(releaseMouse());
  (function nextFadePaintBuffer() {
    dispatch(fadePaintBuffer(1));
    if (getState().graphics.fadePaintBuffer) {
      requestAnimationFrame(nextFadePaintBuffer);
    }
  })();
  mapDataFactory(getState().settings.terrains)
    .fromImageData(getState().graphics.inputBuffer)
    .then(mapData => {
      const originalMapData = getState().graphics.mapData;
      dispatch(setMapData(mapData));
      if (shouldImageUpdate(originalMapData, mapData)) {
        renderImage(getState()).then(outputBuffer => {
          dispatch(setOutputBuffer(outputBuffer));
        });
      }
    });
};

// Settings actions
exports.incrementBrushSize = makeActionCreator('INCREMENT_BRUSH_SIZE');
exports.decrementBrushSize = makeActionCreator('DECREMENT_BRUSH_SIZE');
exports.setTool = makeActionCreator('SET_TOOL', 'tool');
exports.cycleTerrain = makeActionCreator('CYCLE_TERRAIN');
exports.cycleTerrainReverse = makeActionCreator('CYCLE_TERRAIN_REVERSE');

// Workspace actions
exports.resizeApp = makeActionCreator('RESIZE_APP', 'width', 'height');
exports.centerSurface = makeActionCreator('CENTER_SURFACE');
exports.scaleToFit = makeActionCreator('SCALE_TO_FIT');
exports.scaleSurface = makeActionCreator('SCALE_SURFACE', 'delta', 'x', 'y');
