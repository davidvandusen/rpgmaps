const createReducer = require('./createReducer');

module.exports = createReducer({}, {
  SET_CONTROLS_HEIGHT: (state, action) => ({
    ...state,
    controlsHeight: action.payload.height
  }),
  RESIZE_APP: (state, action) => ({
    ...state,
    width: action.payload.width,
    height: action.payload.height
  }),
  CENTER_SURFACE: state => ({
    ...state,
    x: state.width / 2 - state.surface.width * state.scale / 2,
    y: (state.height + state.controlsHeight) / 2 - state.surface.height * state.scale / 2
  }),
  SCALE_TO_FIT: state => {
    const xRatio = state.width / state.surface.width;
    const yRatio = (state.height - state.controlsHeight) / state.surface.height;
    const scale = xRatio < yRatio ? xRatio : yRatio;
    return {
      ...state,
      scale
    };
  },
  SCALE_SURFACE: (state, action) => {
    const scale = Math.max(1, state.scale + action.payload.delta);
    const delta = scale - state.scale;
    const px = ((action.payload.x === undefined ? state.width * 0.5 : action.payload.x) - state.x) / (state.width * state.scale);
    const py = ((action.payload.y === undefined ? state.height * 0.5 : action.payload.y) - state.y) / (state.height * state.scale);
    const dx = delta * state.width * px;
    const dy = delta * state.height * py;
    const x = state.x - dx;
    const y = state.y - dy;
    return {
      ...state,
      scale,
      x,
      y
    };
  },
  TRANSLATE_SURFACE: (state, action) => ({
    ...state,
    x: action.payload.x,
    y: action.payload.y
  })
});
