const createReducer = require('./createReducer');

module.exports = createReducer({}, {
  'MOVE_MOUSE': state => {
    if (state.mouse.isDown) {
      if (state.settings.tool === 'DRAG') {
        return {
          ...state,
          workspace: {
            ...state.workspace,
            x: state.workspace.x - state.mouse.dx,
            y: state.workspace.y - state.mouse.dy
          }
        };
      }
      if (state.settings.tool === 'BRUSH') {
        // TODO add a paint stroke
      }
    }
    return state;
  },
  'RELEASE_MOUSE': state => {
    if (state.settings.tool === 'BRUSH') {
      // TODO transfer the paint stroke from the brush buffer to the input buffer
      // TODO use the input buffer to create the new map data
      // TODO use the map data to draw the new output image
      // TODO then transfer the new output image to the output buffer
    }
    return state;
  }
});
