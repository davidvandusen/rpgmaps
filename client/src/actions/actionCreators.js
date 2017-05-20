const makeActionCreator = require('./makeActionCreator');
const mapDataFactory = require('./mapDataFactory');
const {renderImage, shouldImageUpdate, addStrokeToNewPaintBuffer, addPaintBufferToInputImage} = require('./imageRendering');

// Graphics actions
const setMapData = makeActionCreator('SET_MAP_DATA', 'mapData');
const setInputBuffer = makeActionCreator('SET_INPUT_BUFFER', 'inputBuffer');
const setCrossfadeBuffer = makeActionCreator('SET_CROSSFADE_BUFFER', 'crossfadeBuffer');
const setOutputBuffer = makeActionCreator('SET_OUTPUT_BUFFER', 'outputBuffer');
const setPaintBuffer = makeActionCreator('SET_PAINT_BUFFER', 'paintBuffer');
const setCrossfadeOpacity = makeActionCreator('SET_CROSSFADE_OPACITY', 'crossfadeOpacity');
const resetPaintBuffer = () => (dispatch, getState) => {
  const state = getState();
  const height = state.workspace.surface.height * state.settings.outputQuality;
  const width = state.workspace.surface.width * state.settings.outputQuality;
  const paintBuffer = new ImageData(width, height);
  dispatch(setPaintBuffer(paintBuffer));
};

// Workspace actions
exports.resizeApp = makeActionCreator('RESIZE_APP', 'width', 'height');
exports.centerSurface = makeActionCreator('CENTER_SURFACE');
exports.scaleToFit = makeActionCreator('SCALE_TO_FIT');
exports.scaleSurface = makeActionCreator('SCALE_SURFACE', 'delta', 'x', 'y');
exports.translateSurface = makeActionCreator('TRANSLATE_SURFACE', 'x', 'y');

// Settings actions
exports.incrementBrushSize = makeActionCreator('INCREMENT_BRUSH_SIZE');
exports.decrementBrushSize = makeActionCreator('DECREMENT_BRUSH_SIZE');
exports.setTool = makeActionCreator('SET_TOOL', 'tool');
exports.cycleTerrain = makeActionCreator('CYCLE_TERRAIN');
exports.cycleTerrainReverse = makeActionCreator('CYCLE_TERRAIN_REVERSE');

// Mouse actions
const depressMouse = makeActionCreator('DEPRESS_MOUSE');
const releaseMouse = makeActionCreator('RELEASE_MOUSE');
const moveMouse = makeActionCreator('MOVE_MOUSE', 'x', 'y');
exports.depressMouse = () => (dispatch, getState) => {
  dispatch(depressMouse());
  const state = getState();
  if (state.settings.tool === 'BRUSH') {
    const paintBuffer = addStrokeToNewPaintBuffer(state, false);
    if (paintBuffer) {
      dispatch(setPaintBuffer(paintBuffer));
    }
  }
};
exports.releaseMouse = () => (dispatch, getState) => {
  dispatch(releaseMouse());
  const state = getState();
  if (state.settings.tool === 'BRUSH') {
    const inputBuffer = addPaintBufferToInputImage(state);
    dispatch(setInputBuffer(inputBuffer));
    dispatch(resetPaintBuffer());
    mapDataFactory(state.settings.terrains).fromImageData(inputBuffer).then(mapData => {
      const lastMapData = getState().graphics.mapData;
      if (shouldImageUpdate(lastMapData, mapData)) {
        dispatch(setMapData(mapData));
        return renderImage(getState());
      }
      return Promise.resolve(false);
    }).then(outputBuffer => {
      if (outputBuffer) {
        dispatch(setOutputBuffer(getState().graphics.crossfadeBuffer));
        dispatch(setCrossfadeOpacity(0));
        dispatch(setCrossfadeBuffer(outputBuffer));
        (function next(opacity) {
          if (outputBuffer !== getState().graphics.crossfadeBuffer) return;
          dispatch(setCrossfadeOpacity(opacity));
          if (opacity < 1) {
            requestAnimationFrame(() => next(Math.min(1, opacity + 0.1)));
          }
        })(0.1);
      }
    });
  }
};
exports.moveMouse = (x, y) => (dispatch, getState) => {
  dispatch(moveMouse(x, y));
  const state = getState();
  if (state.mouse.isDown) {
    if (state.settings.tool === 'DRAG') {
      const x = state.workspace.x + state.mouse.dx;
      const y = state.workspace.y + state.mouse.dy;
      dispatch(exports.translateSurface(x, y))
    }
    if (state.settings.tool === 'BRUSH') {
      const paintBuffer = addStrokeToNewPaintBuffer(state, true);
      if (paintBuffer) {
        dispatch(setPaintBuffer(paintBuffer));
      }
    }
  }
};
