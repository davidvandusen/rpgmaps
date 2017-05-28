const seedrandom = require('seedrandom');
const terrainClasses = require('../terrains');
const {addNoise} = require('../common/imageData');
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
  const quality = state.settings.output.quality;
  const scale = state.ui.workspace.scale;
  const x = Math.floor((state.ui.mouse.x - state.ui.workspace.x) / scale * quality);
  const y = Math.floor((state.ui.mouse.y - state.ui.workspace.y) / scale * quality);
  const brushRadius = state.settings.input.brushSize * quality * 0.5;
  const width = state.settings.input.width * quality;
  const height = state.settings.input.height * quality;
  const paintBufferData = state.ui.graphics.paintBuffer.data;
  const rgba = cssToRgba(state.settings.input.terrains[state.settings.input.foreground].color);
  colorCircle(x, y, brushRadius, width, height, rgba, paintBufferData);
  if (addTrail && state.ui.mouse.dx !== undefined && state.ui.mouse.dy !== undefined) {
    const dist = distance(0, 0, state.ui.mouse.dx, state.ui.mouse.dy);
    if (dist > scale * state.settings.input.brushSize * 0.5) {
      const steps = dist / state.settings.input.brushSize * Math.PI;
      const dx = state.ui.mouse.dx / steps;
      const dy = state.ui.mouse.dy / steps;
      for (let step = 1; step < steps; step++) {
        const x = Math.floor((state.ui.mouse.x - state.ui.workspace.x - dx * step) / scale * quality);
        const y = Math.floor((state.ui.mouse.y - state.ui.workspace.y - dy * step) / scale * quality);
        colorCircle(x, y, brushRadius, width, height, rgba, paintBufferData);
      }
    }
  }
  return new ImageData(paintBufferData, width, height);
}
exports.addStrokeToNewPaintBuffer = addStrokeToNewPaintBuffer;

function addPaintBufferToInputImage(state) {
  const paintBufferData = state.ui.graphics.paintBuffer.data;
  const width = state.settings.input.width;
  const height = state.settings.input.height;
  const scaledWidth = width * state.settings.output.quality;
  const numInputIndices = width * height;
  const inputBufferData = new Uint8ClampedArray(numInputIndices * 4);
  inputBufferData.set(state.ui.graphics.inputBuffer.data);
  const rgba = cssToRgba(state.settings.input.terrains[state.settings.input.foreground].color);
  for (let i = 0; i < numInputIndices; i++) {
    const x = i % width + 0.5;
    const y = Math.floor(i / width) + 0.5;
    const scaledX = x * state.settings.output.quality;
    const scaledY = y * state.settings.output.quality;
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
exports.addPaintBufferToInputImage = addPaintBufferToInputImage;

function drawGlobalLight(ctx) {
  const gradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.sqrt(Math.pow(ctx.canvas.width, 2) + Math.pow(ctx.canvas.height, 2)));
  gradient1.addColorStop(1, 'rgba(0,0,0,0.5)');
  gradient1.addColorStop(0, 'rgba(0,0,0,0)');
  const gradient2 = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.sqrt(Math.pow(ctx.canvas.width, 2) + Math.pow(ctx.canvas.height, 2)));
  gradient2.addColorStop(0, 'rgba(255,255,255,0.125)');
  gradient2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = gradient1;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = gradient2;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

function renderImageLayer(mapComponents, layer) {
  return new Promise((resolve, reject) => {
    function next(index) {
      const mapComponent = mapComponents[index];
      if (mapComponent) {
        mapComponent[layer]().then(() => setTimeout(() => next(index + 1), 0));
      } else {
        resolve();
      }
    }

    next(0);
  });
}

function renderImage(state) {
  const canvas = document.createElement('canvas');
  canvas.width = state.settings.input.width * state.settings.output.quality;
  canvas.height = state.settings.input.height * state.settings.output.quality;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#c4b191';
  ctx.fill();
  const rng = seedrandom(state.settings.output.randomnessSeed);
  const mapComponents = state.data.mapData.areas.map((area, areaIndex) => new terrainClasses[area.ctor](state.data.mapData, areaIndex, ctx, rng));
  return renderImageLayer(mapComponents, 'base')
    .then(() => renderImageLayer(mapComponents, 'overlay'))
    .then(() => {
      drawGlobalLight(ctx);
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      addNoise(imageData, 8);
      return Promise.resolve(imageData);
    });
}
exports.renderImage = renderImage;

function shouldImageUpdate(mapData, newMapData) {
  if (!newMapData) return false;
  if (newMapData === mapData) return false;
  if (!mapData) return true;
  if (mapData.areas.length !== newMapData.areas.length) return true;
  for (let i = 0; i < newMapData.areas.length; i++) {
    if (mapData.areas[i].ctor !== newMapData.areas[i].ctor) return true;
    if (!mapData.areas[i].mask.equals(newMapData.areas[i].mask)) return true;
  }
  return false;
}
exports.shouldImageUpdate = shouldImageUpdate;
