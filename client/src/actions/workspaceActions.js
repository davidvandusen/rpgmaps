const makeActionCreator = require('./makeActionCreator');

const resizeWorkspace = makeActionCreator('RESIZE_WORKSPACE', 'width', 'height');
exports.resizeWorkspace = resizeWorkspace;

const scaleWorkspace = makeActionCreator('SCALE_WORKSPACE', 'scale');
exports.scaleWorkspace = scaleWorkspace;

const translateWorkspace = makeActionCreator('TRANSLATE_WORKSPACE', 'x', 'y');
exports.translateWorkspace = translateWorkspace;

const transformWorkspace = makeActionCreator('TRANSFORM_WORKSPACE', 'x', 'y', 'scale');
exports.transformWorkspace = transformWorkspace;

exports.centerWorkspace = () => (dispatch, getState) => {
  const state = getState();
  const scale = state.ui.workspace.scale;
  const workspaceWidth = state.ui.workspace.width;
  const inputWidth = state.settings.input.width;
  const workspaceHeight = state.ui.workspace.height;
  const inputHeight = state.settings.input.height;
  const controlsHeight = state.ui.controls.controlsHeight;
  const x = workspaceWidth / 2 - inputWidth * scale / 2;
  const y = (workspaceHeight + controlsHeight) / 2 - inputHeight * scale / 2;
  dispatch(translateWorkspace(x, y));
};

exports.scaleWorkspaceToFitSurface = () => (dispatch, getState) => {
  const state = getState();
  const workspaceWidth = state.ui.workspace.width;
  const inputWidth = state.settings.input.width;
  const workspaceHeight = state.ui.workspace.height;
  const controlsHeight = state.ui.controls.controlsHeight;
  const inputHeight = state.settings.input.height;
  const xRatio = workspaceWidth / inputWidth;
  const yRatio = (workspaceHeight - controlsHeight) / inputHeight;
  const scale = xRatio < yRatio ? xRatio : yRatio;
  dispatch(scaleWorkspace(scale));
};

exports.zoomWorkspace = (scaleAmount, cx, cy) => (dispatch, getState) => {
  const state = getState();
  const scale = state.ui.workspace.scale;
  const nextScale = Math.max(1, scale + scaleAmount);
  const scaleDelta = nextScale - scale;
  const width = state.ui.workspace.width;
  const height = state.ui.workspace.height;
  const x = state.ui.workspace.x;
  const y = state.ui.workspace.y;
  const px = ((cx === undefined ? width * 0.5 : cx) - x) / (width * scale);
  const py = ((cy === undefined ? height * 0.5 : cy) - y) / (height * scale);
  const dx = scaleDelta * width * px;
  const dy = scaleDelta * height * py;
  const nextX = x - dx;
  const nextY = y - dy;
  dispatch(transformWorkspace(nextX, nextY, nextScale));
};
