const makeActionCreator = require('./makeActionCreator');
const mapDataFactory = require('./mapDataFactory');
const {setMapData} = require('./dataActions');
const {cssToRgba} = require('../common/color');
const {fillImageData} = require('../common/imageData');
const {shouldImageUpdate, renderImage} = require('./imageRendering');

const setInputBuffer = makeActionCreator('SET_INPUT_BUFFER', 'inputBuffer');
exports.setInputBuffer = setInputBuffer;

const setInputOpacity = makeActionCreator('SET_INPUT_OPACITY', 'inputOpacity');
exports.setInputOpacity = setInputOpacity;

const setCrossfadeBuffer = makeActionCreator('SET_CROSSFADE_BUFFER', 'crossfadeBuffer');
exports.setCrossfadeBuffer = setCrossfadeBuffer;

const setCrossfadeOpacity = makeActionCreator('SET_CROSSFADE_OPACITY', 'crossfadeOpacity');
exports.setCrossfadeOpacity = setCrossfadeOpacity;

const setOutputBuffer = makeActionCreator('SET_OUTPUT_BUFFER', 'outputBuffer');
exports.setOutputBuffer = setOutputBuffer;

const setOutputOpacity = makeActionCreator('SET_OUTPUT_OPACITY', 'outputOpacity');
exports.setOutputOpacity = setOutputOpacity;

const setPaintBuffer = makeActionCreator('SET_PAINT_BUFFER', 'paintBuffer');
exports.setPaintBuffer = setPaintBuffer;

const setPaintOpacity = makeActionCreator('SET_PAINT_OPACITY', 'paintOpacity');
exports.setPaintOpacity = setPaintOpacity;

const resetInputBuffer = () => (dispatch, getState) => {
  const state = getState();
  const height = state.settings.input.height;
  const width = state.settings.input.width;
  const inputBuffer = new ImageData(width, height);
  const background = state.settings.input.terrains[state.settings.input.background];
  fillImageData(inputBuffer, ...cssToRgba(background.color));
  dispatch(setInputBuffer(inputBuffer));
  dispatch(processInput());
};
exports.resetInputBuffer = resetInputBuffer;

const resetPaintBuffer = () => (dispatch, getState) => {
  const state = getState();
  const height = state.settings.input.height * state.settings.output.quality;
  const width = state.settings.input.width * state.settings.output.quality;
  const paintBuffer = new ImageData(width, height);
  dispatch(setPaintBuffer(paintBuffer));
};
exports.resetPaintBuffer = resetPaintBuffer;

const processInput = () => (dispatch, getState) => {
  mapDataFactory(getState().settings.input.terrains).fromImageData(getState().ui.graphics.inputBuffer).then(mapData => {
    const lastMapData = getState().data.mapData;
    if (shouldImageUpdate(lastMapData, mapData)) {
      dispatch(setMapData(mapData));
      return renderImage(getState());
    }
    return Promise.resolve(false);
  }).then(outputBuffer => {
    if (outputBuffer) {
      dispatch(setCrossfadeOpacity(0));
      dispatch(setCrossfadeBuffer(outputBuffer));
      const fadeIncrement = 0.04;
      (function next(opacity) {
        if (outputBuffer !== getState().ui.graphics.crossfadeBuffer) return;
        dispatch(setCrossfadeOpacity(opacity));
        if (opacity < 1) {
          requestAnimationFrame(() => next(opacity + fadeIncrement));
        } else {
          dispatch(setOutputBuffer(getState().ui.graphics.crossfadeBuffer));
          dispatch(setCrossfadeBuffer());
        }
      })(fadeIncrement);
    }
  });
};
exports.processInput = processInput;
