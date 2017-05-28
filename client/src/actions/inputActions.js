const makeActionCreator = require('./makeActionCreator');

const setBrushSize = makeActionCreator('SET_BRUSH_SIZE', 'brushSize');
exports.setBrushSize = setBrushSize;

exports.decrementBrushSize = () => (dispatch, getState) => {
  dispatch(setBrushSize(getState().settings.input.brushSize - 1));
};

exports.incrementBrushSize = () => (dispatch, getState) => {
  dispatch(setBrushSize(getState().settings.input.brushSize + 1));
};

const setTerrains = makeActionCreator('SET_TERRAINS', 'terrains');
exports.setTerrains = setTerrains;

const setDefaultBackground = makeActionCreator('SET_DEFAULT_BACKGROUND', 'defaultBackground');
exports.setDefaultBackground = setDefaultBackground;

const setDefaultForeground = makeActionCreator('SET_DEFAULT_FOREGROUND', 'defaultForeground');
exports.setDefaultForeground = setDefaultForeground;

const setBackground = makeActionCreator('SET_BACKGROUND', 'background');
exports.setBackground = setBackground;

const setForeground = makeActionCreator('SET_FOREGROUND', 'foreground');
exports.setForeground = setForeground;

exports.cycleForeground = () => (dispatch, getState) => {
  const state = getState();
  const foreground = state.settings.input.foreground;
  const nextForeground = foreground === state.settings.input.terrains.length - 1 ? 0 : foreground + 1;
  dispatch(setForeground(nextForeground));
};

exports.cycleForegroundReverse = () => (dispatch, getState) => {
  const state = getState();
  const foreground = state.settings.input.foreground;
  const prevForeground = foreground === 0 ? state.settings.input.terrains.length - 1 : foreground - 1;
  dispatch(setForeground(prevForeground));
};

const setTool = makeActionCreator('SET_TOOL', 'tool');
exports.setTool = setTool;
