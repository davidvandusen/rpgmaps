const seedrandom = require('seedrandom');
const terrainClasses = require('../terrains');
const {addNoise} = require('../common/imageData');

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
  canvas.width = state.workspace.surface.width * state.settings.outputQuality;
  canvas.height = state.workspace.surface.height * state.settings.outputQuality;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#c4b191';
  ctx.fill();
  const rng = seedrandom(state.settings.randomnessSeed);
  const mapComponents = state.graphics.mapData.areas.map((area, areaIndex) => new terrainClasses[area.ctor](state.graphics.mapData, areaIndex, ctx, rng));
  return renderImageLayer(mapComponents, 'base')
    .then(() => renderImageLayer(mapComponents, 'overlay'))
    .then(() => {
      drawGlobalLight(ctx);
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      addNoise(imageData, 8);
      return Promise.resolve(imageData);
    });
}

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

module.exports = {
  shouldImageUpdate,
  renderImage
};
