const outputWidth = window.innerWidth;
const outputHeight = window.innerHeight;
const inputWidth = 128;
const inputHeight = 72;
const xRatio = (outputWidth - 20) / inputWidth;
const yRatio = (outputHeight - 150) / inputHeight;
const initialScale = xRatio < yRatio ? xRatio : yRatio;
module.exports = {
  width: outputWidth,
  height: outputHeight,
  captureStroke: false,
  mouse: {
    x: undefined,
    y: undefined
  },
  brush: {
    size: 5
  },
  inputImageData: undefined,
  surface: {
    scale: initialScale,
    x: outputWidth / 2 - inputWidth * initialScale / 2,
    y: outputHeight / 2 - inputHeight * initialScale / 2,
    width: inputWidth,
    height: inputHeight
  }
};
