const makeActionCreator = require('./makeActionCreator');
const {processInput, setInputBuffer, setPaintBuffer, resetPaintBuffer} = require('./graphicsActions');
const {addStrokeToNewPaintBuffer, addPaintBufferToInputImage} = require('./imageRendering');
const {translateWorkspace} = require('./workspaceActions');

const mouseInWorkspace = makeActionCreator('MOUSE_IN_WORKSPACE', 'inWorkspace');
exports.mouseInWorkspace = mouseInWorkspace;

const depressMouse = makeActionCreator('DEPRESS_MOUSE');

exports.depressMouse = () => (dispatch, getState) => {
  dispatch(depressMouse());
  const state = getState();
  if (state.ui.mouse.inWorkspace && state.ui.graphics.inputBuffer && state.settings.input.tool === 'BRUSH') {
    const paintBuffer = addStrokeToNewPaintBuffer(state, false);
    dispatch(setPaintBuffer(paintBuffer));
  }
};

const releaseMouse = makeActionCreator('RELEASE_MOUSE');

exports.releaseMouse = () => (dispatch, getState) => {
  dispatch(releaseMouse());
  const state = getState();
  if (state.ui.mouse.inWorkspace && state.ui.graphics.inputBuffer && state.settings.input.tool === 'BRUSH') {
    const inputBuffer = addPaintBufferToInputImage(state);
    dispatch(setInputBuffer(inputBuffer));
    dispatch(resetPaintBuffer());
    dispatch(processInput())
  }
};

const moveMouse = makeActionCreator('MOVE_MOUSE', 'x', 'y');

exports.moveMouse = (x, y) => (dispatch, getState) => {
  dispatch(moveMouse(x, y));
  const state = getState();
  if (state.ui.mouse.isDown && state.ui.mouse.inWorkspace) {
    if (state.settings.input.tool === 'DRAG') {
      const x = state.ui.workspace.x + state.ui.mouse.dx;
      const y = state.ui.workspace.y + state.ui.mouse.dy;
      dispatch(translateWorkspace(x, y))
    }
    if (state.ui.graphics.inputBuffer && state.settings.input.tool === 'BRUSH') {
      const paintBuffer = addStrokeToNewPaintBuffer(state, true);
      dispatch(setPaintBuffer(paintBuffer));
    }
  }
};
