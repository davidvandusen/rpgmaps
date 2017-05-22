const {cssToRgba} = require('../common/color');
const {fillImageData} = require('../common/imageData');
const terrains = require('../terrains/config');

const defaultTool = 'BRUSH';
const defaultRandomnessSeed = '';
const defaultInputImageOpacity = 0;
const defaultGridType = 'pointy-top-hex';
const defaultGridSpacing = 4;
const defaultGridShow = true;
const defaultGridLineWidth = 0.05;
const defaultGridLineColor = 'rgba(80,80,80,1)';
const defaultBrushSize = 5;
const defaultBrushShape = 'CIRCLE';
const defaultForeground = "CloseUpPath";
const defaultTerrain = terrains.findIndex(t => t.className === defaultForeground);
const defaultBackground = "CloseUpGrass";
const outputQuality = 10;
const inputWidth = 128;
const inputHeight = 72;
const inputBuffer = new ImageData(inputWidth, inputHeight);
const crossfadeBuffer = new ImageData(inputWidth * outputQuality, inputHeight * outputQuality);
const outputBuffer = new ImageData(inputWidth * outputQuality, inputHeight * outputQuality);
const paintBuffer = new ImageData(inputWidth * outputQuality, inputHeight * outputQuality);

fillImageData(inputBuffer, ...cssToRgba(terrains.find(t => t.className === defaultBackground).color));

module.exports = {
  graphics: {
    inputBuffer,
    outputBuffer,
    crossfadeBuffer,
    paintBuffer,
    mapData: undefined,
    crossfadeOpacity: 0
  },
  mouse: {
    inWorkspace: undefined,
    dx: undefined,
    dy: undefined,
    isDown: false,
    isUp: true,
    x: undefined,
    y: undefined
  },
  settings: {
    brush: {
      shape: defaultBrushShape,
      size: defaultBrushSize
    },
    defaultBackground,
    defaultForeground,
    grid: {
      lineColor: defaultGridLineColor,
      lineWidth: defaultGridLineWidth,
      show: defaultGridShow,
      spacing: defaultGridSpacing,
      type: defaultGridType
    },
    inputImageOpacity: defaultInputImageOpacity,
    outputQuality,
    randomnessSeed: defaultRandomnessSeed,
    terrain: defaultTerrain,
    terrains,
    tool: defaultTool,
  },
  ui: {
    menuOpen: undefined
  },
  workspace: {
    controlsHeight: 0,
    scale: 1,
    surface: {
      height: inputHeight,
      width: inputWidth
    },
    width: 0,
    height: 0,
    x: 0,
    y: 0
  }
};
