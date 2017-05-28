const {zoomWorkspace, centerWorkspace, scaleWorkspaceToFitSurface} = require('../actions/workspaceActions');
const {setTool} = require('../actions/inputActions');

module.exports = (dispatch) => ({
  down: {
    ' ': () => dispatch(setTool('DRAG')),
    'c': () => dispatch(centerWorkspace()),
    'z': () => {
      dispatch(scaleWorkspaceToFitSurface());
      dispatch(zoomWorkspace(-1));
      dispatch(centerWorkspace());
    }
  },
  up: {
    // TODO this should set the tool back to whatever it was before space was pressed
    ' ': () => dispatch(setTool('NONE'))
  }
});
