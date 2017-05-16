const {cssToRgba} = require('./common/color');
const {fillImageData} = require('./common/imageData');
const terrains = require('./terrains/config');
const grids = [{
  id: 'pointy-top-hex',
  label: 'Pointy Top Hex'
}, {
  id: 'flat-top-hex',
  label: 'Flat Top Hex'
}, {
  id: 'square',
  label: 'Square'
}];

const defaultGrid = 'pointy-top-hex';
const inputWidth = 128;
const inputHeight = 72;
const defaultForeground = "CloseUpPath";
const defaultTerrain = terrains.findIndex(t => t.className === defaultForeground);
const defaultBackground = "CloseUpGrass";
const outputQuality = 10;
const paintBuffer = new ImageData(inputWidth * outputQuality, inputHeight * outputQuality);
const outputBuffer = new ImageData(inputWidth * outputQuality, inputHeight * outputQuality);
const inputBuffer = new ImageData(inputWidth, inputHeight);
fillImageData(inputBuffer, ...cssToRgba(terrains.find(t => t.className === defaultBackground).color));

module.exports = {
  graphics: {
    inputBuffer: inputBuffer,
    outputBuffer: outputBuffer,
    paintBuffer: paintBuffer
  },
  mouse: {
    dx: undefined,
    dy: undefined,
    isDown: false,
    isUp: true,
    x: undefined,
    y: undefined
  },
  settings: {
    brush: {
      shape: 'CIRCLE',
      size: 5
    },
    defaultBackground: defaultBackground,
    defaultForeground: defaultForeground,
    grid: {
      lineColor: 'rgba(0,0,0,1)',
      lineWidth: 0.05,
      show: true,
      spacing: 4,
      type: defaultGrid
    },
    grids: grids,
    inputImageOpacity: 0.5,
    outputQuality: outputQuality,
    randomnessSeed: '',
    terrain: defaultTerrain,
    terrains: terrains,
    tool: 'BRUSH',
  },
  workspace: {
    height: undefined,
    scale: 1,
    surface: {
      height: inputHeight,
      width: inputWidth
    },
    width: undefined,
    x: 0,
    y: 0
  }
};
