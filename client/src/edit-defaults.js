const {cssToRgba} = require('./common/color');
const {fillImageData} = require('./common/imageData');
const terrains = require('./terrains/config');

const inputWidth = 128;
const inputHeight = 72;
const defaultForeground = "CloseUpPath";
const defaultTerrain = terrains.findIndex(t => t.className === defaultForeground);
const defaultBackground = "CloseUpGrass";
const inputImageData = new ImageData(inputWidth, inputHeight);
fillImageData(inputImageData, ...cssToRgba(terrains.find(t => t.className === defaultBackground).color));

module.exports = {
  width: undefined,
  height: undefined,
  randomnessSeed: '',
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
    scale: 1,
    x: 0,
    y: 0,
    width: inputWidth,
    height: inputHeight
  },
  defaultBackground: defaultBackground,
  defaultForeground: defaultForeground,
  terrain: defaultTerrain,
  terrains: terrains
};
