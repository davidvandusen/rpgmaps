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
    case 'CENTER_SURFACE':
      return {...state, surface: {
        ...state.surface,
        x: state.width / 2 - state.surface.width * state.surface.scale / 2,
        y: state.height / 2 - state.surface.height * state.surface.scale / 2
      }};
    case 'SCALE_SURFACE':
      const scale = Math.max(1, state.surface.scale + action.payload.delta);
      const delta = scale - state.surface.scale;
      const px = (action.payload.x - state.surface.x) / (state.width * scale);
      const py = (action.payload.y - state.surface.y) / (state.height * scale);
      const dx = delta * state.width * px;
      const dy = delta * state.height * py;
      const x = state.surface.x - dx;
      const y = state.surface.y - dy;
      return {
        ...state,
        surface: {
          ...state.surface,
          scale,
          x,
          y
        }
      };
    case 'PAINT_INPUT':
      if (action.payload.indices.length === 0) return state;
      const dataArray = new Uint8ClampedArray(state.surface.width * state.surface.height * 4);
      if (state.inputImageData) {
        dataArray.set(state.inputImageData.data);
      }
      for (const index of action.payload.indices) {
        // TODO this should be the color of the selected terrain
        dataArray[index * 4] = 0x80;
        dataArray[index * 4 + 1] = 0x80;
        dataArray[index * 4 + 2] = 0x80;
        dataArray[index * 4 + 3] = 0xff;
      }
      const inputImageData = new ImageData(dataArray, state.surface.width, state.surface.height);
      return {...state, inputImageData};
    default:
      return state;
  }
};

module.exports = editApp;
