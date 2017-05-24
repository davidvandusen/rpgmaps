const createReducer = require('./createReducer');

module.exports = createReducer({
  inputBuffer: undefined,
  inputOpacity: undefined,
  outputBuffer: undefined,
  outputOpacity: undefined,
  crossfadeBuffer: undefined,
  crossfadeOpacity: undefined,
  paintBuffer: undefined,
  paintOpacity: undefined
}, {
  SET_INPUT_BUFFER: (state, {payload}) => ({
    ...state,
    inputBuffer: payload.inputBuffer
  }),
  SET_INPUT_OPACITY: (state, {payload}) => ({
    ...state,
    inputOpacity: Math.max(0, Math.min(1, payload.inputOpacity))
  }),
  SET_OUTPUT_BUFFER: (state, {payload}) => ({
    ...state,
    outputBuffer: payload.outputBuffer
  }),
  SET_OUTPUT_OPACITY: (state, {payload}) => ({
    ...state,
    outputOpacity: Math.max(0, Math.min(1, payload.outputOpacity))
  }),
  SET_CROSSFADE_BUFFER: (state, {payload}) => ({
    ...state,
    crossfadeBuffer: payload.crossfadeBuffer
  }),
  SET_CROSSFADE_OPACITY: (state, {payload}) => ({
    ...state,
    crossfadeOpacity: Math.max(0, Math.min(1, payload.crossfadeOpacity))
  }),
  SET_PAINT_BUFFER: (state, {payload}) => ({
    ...state,
    paintBuffer: payload.paintBuffer
  }),
  SET_PAINT_OPACITY: (state, {payload}) => ({
    ...state,
    paintOpacity: Math.max(0, Math.min(1, payload.paintOpacity))
  })
});
