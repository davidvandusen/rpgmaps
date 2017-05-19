const createReducer = require('./createReducer');
const {pointInCircle, distance} = require('../common/geometry');
const {cssToRgba} = require('../common/color');

function forEachPointInCircle(cx, cy, r, cb) {
  for (let y = cy - r; y < cy + r; y++) {
    for (let x = cx - r; x < (cx + r); x++) {
      if (pointInCircle(x, y, cx, cy, r)) {
        cb(x, y);
      }
    }
  }
}

function colorCircle(cx, cy, r, w, h, rgba, data) {
  forEachPointInCircle(cx, cy, r, (px, py) => {
    if (px < 0 || py < 0 || px >= w || py >= h) return;
    const pixelIndex = Math.floor(px + py * w);
    const rgbaIndex = pixelIndex * 4;
    data[rgbaIndex] = rgba[0];
    data[rgbaIndex + 1] = rgba[1];
    data[rgbaIndex + 2] = rgba[2];
    data[rgbaIndex + 3] = rgba[3];
  });
}

function addStrokeToNewPaintBuffer(state, addTrail) {
  const width = state.workspace.surface.width * state.settings.outputQuality;
  const height = state.workspace.surface.height * state.settings.outputQuality;
  const x = Math.floor((state.mouse.x - state.workspace.x) / state.workspace.scale * state.settings.outputQuality);
  const y = Math.floor((state.mouse.y - state.workspace.y) / state.workspace.scale * state.settings.outputQuality);
  const brushRadius = state.settings.brush.size * state.settings.outputQuality * 0.5;
  // FIXME if the last position of the mouse was inside this area, then still draw the stroke
  if (x >= -brushRadius && x < width + brushRadius && y >= -brushRadius && y < height + brushRadius) {
    const paintBufferData = new Uint8ClampedArray(width * height * 4);
    paintBufferData.set(state.graphics.paintBuffer.data);
    const rgba = cssToRgba(state.settings.terrains[state.settings.terrain].color);
    colorCircle(x, y, brushRadius, width, height, rgba, paintBufferData);
    if (addTrail && state.mouse.dx !== undefined && state.mouse.dy !== undefined) {
      const dist = distance(0, 0, state.mouse.dx, state.mouse.dy);
      if (dist > state.workspace.scale * state.settings.brush.size * 0.5) {
        const steps = dist / state.settings.brush.size * Math.PI;
        const dx = state.mouse.dx / steps;
        const dy = state.mouse.dy / steps;
        for (let step = 1; step < steps; step++) {
          const x = Math.floor((state.mouse.x - state.workspace.x - dx * step) / state.workspace.scale * state.settings.outputQuality);
          const y = Math.floor((state.mouse.y - state.workspace.y - dy * step) / state.workspace.scale * state.settings.outputQuality);
          colorCircle(x, y, brushRadius, width, height, rgba, paintBufferData);
        }
      }
    }
    return new ImageData(paintBufferData, width, height);
  }
}

function addPaintBufferToInputImage(state) {
  const paintBufferData = state.graphics.paintBuffer.data;
  const width = state.workspace.surface.width;
  const height = state.workspace.surface.height;
  const scaledWidth = width * state.settings.outputQuality;
  const numInputIndices = width * height;
  const inputBufferData = new Uint8ClampedArray(numInputIndices * 4);
  inputBufferData.set(state.graphics.inputBuffer.data);
  const rgba = cssToRgba(state.settings.terrains[state.settings.terrain].color);
  for (let i = 0; i < numInputIndices; i++) {
    const x = i % width + 0.5;
    const y = Math.floor(i / width) + 0.5;
    const scaledX = x * state.settings.outputQuality;
    const scaledY = y * state.settings.outputQuality;
    const paintPixelIndex = Math.floor(scaledX + scaledY * scaledWidth);
    const alphaIndex = paintPixelIndex * 4 + 3;
    if (paintBufferData[alphaIndex] === 0xff) {
      const inputPixelIndex = i * 4;
      inputBufferData[inputPixelIndex] = rgba[0];
      inputBufferData[inputPixelIndex + 1] = rgba[1];
      inputBufferData[inputPixelIndex + 2] = rgba[2];
      inputBufferData[inputPixelIndex + 3] = rgba[3];
    }
  }
  return new ImageData(inputBufferData, width, height);
}

module.exports = createReducer({}, {
  MOVE_MOUSE: state => {
    if (state.mouse.isDown) {
      if (state.settings.tool === 'DRAG') {
        return {
          ...state,
          workspace: {
            ...state.workspace,
            x: state.workspace.x + state.mouse.dx,
            y: state.workspace.y + state.mouse.dy
          }
        };
      }
      if (state.settings.tool === 'BRUSH') {
        const paintBuffer = addStrokeToNewPaintBuffer(state, true);
        if (paintBuffer) {
          return {
            ...state,
            graphics: {
              ...state.graphics,
              paintBuffer,
              fadePaintBuffer: false
            }
          };
        }
      }
    }
    return state;
  },
  DEPRESS_MOUSE: state => {
    if (state.settings.tool === 'BRUSH') {
      const paintBuffer = addStrokeToNewPaintBuffer(state, false);
      if (paintBuffer) {
        return {
          ...state,
          graphics: {
            ...state.graphics,
            paintBuffer,
            fadePaintBuffer: false
          }
        };
      }
    }
    return state;
  },
  RELEASE_MOUSE: state => {
    if (state.settings.tool === 'BRUSH') {
      const inputBuffer = addPaintBufferToInputImage(state);
      if (inputBuffer) {
        return {
          ...state,
          graphics: {
            ...state.graphics,
            inputBuffer,
            fadePaintBuffer: true
          }
        };
      }
    }
    return state;
  }
});
