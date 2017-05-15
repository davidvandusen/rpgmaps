const {cssToRgba} = require('./common/color');
const terrains = require('./terrains/config');

const outputWidth = window.innerWidth;
const outputHeight = window.innerHeight;
const inputWidth = 128;
const inputHeight = 72;
const xRatio = (outputWidth - 20) / inputWidth;
const yRatio = (outputHeight - 150) / inputHeight;
const initialScale = xRatio < yRatio ? xRatio : yRatio;
const defaultForeground = "CloseUpPath";
const defaultTerrain = terrains.findIndex(t => t.className === defaultForeground);
const defaultBackground = "CloseUpGrass";
const inputImageDataArray = new Uint8ClampedArray(inputWidth * inputHeight * 4);
const defaultBackgroundColor = cssToRgba(terrains.find(t => t.className === defaultBackground).color);
for (let i = 0; i < inputImageDataArray.length; i += 4) {
  inputImageDataArray[i] = defaultBackgroundColor[0];
  inputImageDataArray[i + 1] = defaultBackgroundColor[1];
  inputImageDataArray[i + 2] = defaultBackgroundColor[2];
  inputImageDataArray[i + 3] = defaultBackgroundColor[3];
}
const inputImageData = new ImageData(inputImageDataArray, inputWidth, inputHeight);

module.exports = {
  width: outputWidth,
  height: outputHeight,
  tool: 'BRUSH',
  mouse: {
    x: undefined,
    y: undefined,
    isDown: false,
    isUp: true
  },
  brush: {
    size: 5
  },
  frame: {
    show: true,
    width: 1.5
  },
  grid: {
    show: false,
    type: 'pointy-top-hex',
    spacing: 4,
    lineWidth: 0.05,
    lineColor: 'rgba(0,0,0,0.1)'
  },
  grids: [{
    id: 'pointy-top-hex',
    label: 'Pointy Top Hex'
  }, {
    id: 'flat-top-hex',
    label: 'Flat Top Hex'
  }, {
    id: 'square',
    label: 'Square'
  }],
  inputImageOpacity: 0,
  inputImageData: inputImageData,
  outputQuality: 10,
  surface: {
    scale: initialScale,
    x: outputWidth / 2 - inputWidth * initialScale / 2,
    y: outputHeight / 2 - inputHeight * initialScale / 2,
    width: inputWidth,
    height: inputHeight
  },
  defaultBackground: defaultBackground,
  defaultForeground: defaultForeground,
  terrain: defaultTerrain,
  terrains: terrains
};
