const createReducer = require('./createReducer');

module.exports = createReducer({}, {
  SET_INPUT_BUFFER: (state, action) => ({...state, inputBuffer: action.payload.inputBuffer}),
  SET_OUTPUT_BUFFER: (state, action) => ({...state, outputBuffer: action.payload.outputBuffer}),
  SET_PAINT_BUFFER: (state, action) => ({...state, paintBuffer: action.payload.paintBuffer}),
  SET_MAP_DATA: (state, action) => ({...state, mapData: action.payload.mapData}),
  FADE_PAINT_BUFFER: (state, action) => {
    if (state.fadePaintBuffer) {
      const width = state.paintBuffer.width;
      const height = state.paintBuffer.height;
      const paintBufferData = new Uint8ClampedArray(width * height * 4);
      paintBufferData.set(state.paintBuffer.data);
      let visiblePixelsRemain = false;
      for (let i = 3; i < paintBufferData.length; i += 4) {
        paintBufferData[i] -= action.payload.amount;
        if (paintBufferData[i] > 0) visiblePixelsRemain = true;
      }
      const paintBuffer = new ImageData(paintBufferData, width, height);
      return {
        ...state,
        paintBuffer,
        fadePaintBuffer: visiblePixelsRemain
      }
    }
    return state;
  }
});
