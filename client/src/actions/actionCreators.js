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

// UI actions
exports.toggleMenu = makeActionCreator('TOGGLE_MENU', 'menu');

// Workspace actions
exports.resizeApp = makeActionCreator('RESIZE_APP', 'width', 'height');
exports.centerSurface = makeActionCreator('CENTER_SURFACE');
exports.scaleToFit = makeActionCreator('SCALE_TO_FIT');
const scaleSurface = makeActionCreator('SCALE_SURFACE', 'delta', 'x', 'y');
exports.scaleSurface = (delta, x, y, usingWheel = false) => (dispatch, getState) => {
  if (!usingWheel || getState().mouse.inWorkspace) dispatch(scaleSurface(delta, x, y));
};
exports.translateSurface = makeActionCreator('TRANSLATE_SURFACE', 'x', 'y');
exports.setControlsHeight = makeActionCreator('SET_CONTROLS_HEIGHT', 'height');

// Settings actions
exports.incrementBrushSize = makeActionCreator('INCREMENT_BRUSH_SIZE');
exports.decrementBrushSize = makeActionCreator('DECREMENT_BRUSH_SIZE');
exports.setBrushSize = makeActionCreator('SET_BRUSH_SIZE', 'size');
exports.setTerrain = makeActionCreator('SET_TERRAIN', 'index');
exports.cycleTerrain = makeActionCreator('CYCLE_TERRAIN');
exports.cycleTerrainReverse = makeActionCreator('CYCLE_TERRAIN_REVERSE');
const setTool = makeActionCreator('SET_TOOL', 'tool');
module.exports.setTool = (tool, force = false) => (dispatch, getState) => {
  if (getState().mouse.isUp || force) {
    dispatch(setTool(tool));
  }
};

// Mouse actions
const mouseInWorkspace = makeActionCreator('MOUSE_IN_WORKSPACE', 'inWorkspace');
exports.mouseInWorkspace = inWorkspace => (dispatch, getState) => {
  if (inWorkspace) {
    dispatch(setTool('BRUSH'));
  } else if (getState().mouse.isUp) {
    dispatch(setTool('NONE'));
  }
  dispatch(mouseInWorkspace(inWorkspace));
};
const depressMouse = makeActionCreator('DEPRESS_MOUSE');
const releaseMouse = makeActionCreator('RELEASE_MOUSE');
const moveMouse = makeActionCreator('MOVE_MOUSE', 'x', 'y');
exports.depressMouse = () => (dispatch, getState) => {
  dispatch(depressMouse());
  const state = getState();
  if (state.mouse.inWorkspace && state.settings.tool === 'BRUSH') {
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
        const fadeIncrement = 0.04;
        (function next(opacity) {
          if (outputBuffer !== getState().graphics.crossfadeBuffer) return;
          dispatch(setCrossfadeOpacity(opacity));
          if (opacity < 1) {
            requestAnimationFrame(() => next(Math.min(1, opacity + fadeIncrement)));
          }
        })(fadeIncrement);
      }
    });
  }
};
exports.moveMouse = (x, y) => (dispatch, getState) => {
  dispatch(moveMouse(x, y));
  const state = getState();
  if (state.mouse.isDown && state.mouse.inWorkspace) {
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
