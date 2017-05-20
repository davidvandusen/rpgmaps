const createReducer = require('./createReducer');

module.exports = createReducer({}, {
  SET_INPUT_BUFFER: (state, action) => ({...state, inputBuffer: action.payload.inputBuffer}),
  SET_OUTPUT_BUFFER: (state, action) => ({...state, outputBuffer: action.payload.outputBuffer}),
  SET_CROSSFADE_BUFFER: (state, action) => ({...state, crossfadeBuffer: action.payload.crossfadeBuffer}),
  SET_PAINT_BUFFER: (state, action) => ({...state, paintBuffer: action.payload.paintBuffer}),
  SET_MAP_DATA: (state, action) => ({...state, mapData: action.payload.mapData}),
  SET_CROSSFADE_OPACITY: (state, action) => ({...state, crossfadeOpacity: action.payload.crossfadeOpacity})
});
