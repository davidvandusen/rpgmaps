const {incrementBrushSize, decrementBrushSize, setTool, cycleForeground, cycleForegroundReverse} = require('../actions/inputActions');
const {zoomWorkspace, centerWorkspace, scaleWorkspaceToFitSurface} = require('../actions/workspaceActions');
const {setInputOpacity} = require('../actions/graphicsActions');

module.exports = (dispatch) => ({
  down: {
    ' ': () => dispatch(setTool('DRAG')),
    "'": () => dispatch(cycleForeground()),
    ';': () => dispatch(cycleForegroundReverse()),
    ']': () => dispatch(incrementBrushSize()),
    '[': () => dispatch(decrementBrushSize()),
    'c': () => dispatch(centerWorkspace()),
    'i': () => dispatch(setInputOpacity(1)),
    'z': () => {
      dispatch(scaleWorkspaceToFitSurface());
      dispatch(zoomWorkspace(-1));
      dispatch(centerWorkspace());
    }
  },
  up: {
    // TODO this should set the tool back to whatever it was before space was pressed
    ' ': () => dispatch(setTool('BRUSH')),
    'i': () => dispatch(setInputOpacity(0))
  }
});
