const config = require('../../src/config.json');
const seedrandom = require('seedrandom');
const Terrain = require('../../src/terrains/CloseUpRoad');
const mapDataFactory = require('../../src/common/mapDataFactory')(config.terrains);

const fillStyle = config.terrains.find(t => t.className === Terrain.name).color;

const examples = [
  (ctx) => {
    ctx.fillStyle = fillStyle;
    ctx.fillRect(2, 2, ctx.canvas.width - 4, ctx.canvas.height - 4);
  },
  (ctx) => {
    ctx.rect(1, 1, ctx.canvas.width - 2, ctx.canvas.height - 2);
    ctx.rect(3, 3, ctx.canvas.width - 6, ctx.canvas.height - 6);
    ctx.clip('evenodd');
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
];

examples.forEach(example => {
  const inputCanvas = document.createElement('canvas');
  document.body.appendChild(inputCanvas);
  inputCanvas.width = 10;
  inputCanvas.height = 10;
  inputCanvas.style.width = '200px';
  inputCanvas.style.height = '200px';
  inputCanvas.style.imageRendering = 'pixelated';
  const inputCtx = inputCanvas.getContext('2d');
  inputCtx.fillStyle = config.terrains[config.terrains.length - 1].color;
  inputCtx.fillRect(0, 0, inputCanvas.width, inputCanvas.height);
  example(inputCtx);
  const outputCanvas = document.createElement('canvas');
  document.body.appendChild(outputCanvas);
  outputCanvas.width = 200;
  outputCanvas.height = 200;
  const outputCtx = outputCanvas.getContext('2d');
  outputCtx.fillStyle = '#b3a386';
  outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
  const rng = seedrandom('');
  const imageData = inputCtx.getImageData(0, 0, inputCanvas.width, inputCanvas.height);
  mapDataFactory.fromImageData(imageData).then(mapData => {
    mapData.areas.forEach((area, i) => {
      if (area.ctor === Terrain.name) {
        const terrain = new Terrain(mapData, i, outputCtx, rng);
        terrain.base();
        terrain.overlay();
      }
    });
  });
});
