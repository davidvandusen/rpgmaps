const editApp = (state, action) => {
  switch (action.type) {
    case 'BEGIN_CAPTURE_STROKE':
      return {...state, captureStroke: true};
    case 'END_CAPTURE_STROKE':
      return {...state, captureStroke: false};
    case 'DECREMENT_BRUSH_SIZE':
      return {...state, brush: {...state.brush, size: Math.max(1, state.brush.size - 1)}};
    case 'INCREMENT_BRUSH_SIZE':
      return {...state, brush: {...state.brush, size: state.brush.size + 1}};
    case 'MOVE_MOUSE':
      return {...state, ...action.payload};
    case 'RESIZE_APP':
      return {...state, ...action.payload};
    case 'SCALE_SURFACE':
      // TODO update surface x and y based on payload x and y position so that scaling is centered around the mouse
      return {...state, surface: {...state.surface, scale: Math.max(0.1, state.surface.scale + action.payload.delta)}};
    default:
      return state;
  }
};

module.exports = editApp;
