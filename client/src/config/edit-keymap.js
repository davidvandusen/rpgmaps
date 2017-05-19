module.exports = (dispatch, actions) => ({
  down: {
    ' ': () => dispatch(actions.setTool('DRAG')),
    "'": () => dispatch(actions.cycleTerrain()),
    ';': () => dispatch(actions.cycleTerrainReverse()),
    ']': () => dispatch(actions.incrementBrushSize()),
    '[': () => dispatch(actions.decrementBrushSize()),
    'c': () => dispatch(actions.centerSurface()),
    'z': () => {
      dispatch(actions.scaleToFit());
      dispatch(actions.centerSurface());
    }
  },
  up: {
    ' ': () => dispatch(actions.setTool('BRUSH'))
  }
});
