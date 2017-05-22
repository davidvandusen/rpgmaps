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
    // TODO this should set the tool back to whatever it was before space was pressed
    ' ': () => dispatch(actions.setTool('BRUSH'))
  }
});
