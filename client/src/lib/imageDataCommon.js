import seedrandom from 'seedrandom';
import AreaMask from './AreaMask';

function areSamePixels(dataA, dataB) {
  if (dataA.length !== dataB.length) return false;
  for (let i = 0; i < dataA.length; ++i) {
    if (dataA[i] !== dataB[i]) return false;
  }
  return true;
}

function fillImageData(imageData, red, green, blue, alpha) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = red;
    data[i + 1] = green;
    data[i + 2] = blue;
    data[i + 3] = alpha;
  }
}

function detectAreas(imageData) {
  let pixels = new Uint32Array(imageData.data.buffer);
  return new Promise((resolve, reject) =>
    setTimeout(() =>
      resolve(detectAreasRecursive(pixels, imageData.width, [])), 0));
}

function firstUnmaskedPixel(length, areas) {
  if (!areas.length) return 0;
  for (let i = 0; i < length; i++) if (!areas.some(area => area.mask.get(i))) return i;
  return -1;
}

function detectAreasRecursive(pixels, width, areas) {
  const startIndex = firstUnmaskedPixel(pixels.length, areas);
  if (startIndex === -1) return Promise.resolve(areas);
  return describeContiguousArea(pixels, width, startIndex)
    .then(area => detectAreasRecursive(pixels, width, areas.concat([area])));
}

function describeContiguousArea(pixels, width, startIndex) {
  return new Promise((resolve, reject) => {
    const mask = new AreaMask(pixels.length, width);
    const color = pixels[startIndex];
    const floodFillFromStartIndex = (function floodFill(index) {
      if (mask.get(index)) return Promise.resolve();
      if (pixels[index] !== color) return Promise.resolve();
      mask.set(index, true);
      const nextIndices = [];
      if (index >= width) nextIndices.push(index - width);
      if (index % width !== width - 1) nextIndices.push(index + 1);
      if (pixels.length >= index + width) nextIndices.push(index + width);
      if (index > 0 && index % width > 0) nextIndices.push(index - 1);
      return Promise.all(
        nextIndices.map(index =>
          new Promise((resolve, reject) =>
            setTimeout(() =>
              resolve(floodFill(index)), 0))));
    }(startIndex));
    floodFillFromStartIndex.then(() => resolve({color, mask}));
  });
}

function addNoise(ctx, amount) {
  const rng = seedrandom('');
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const by = (rng() * 2 - 1) * amount;
    imageData.data[i] += by;
    imageData.data[i + 1] += by;
    imageData.data[i + 2] += by;
  }
  ctx.putImageData(imageData, 0, 0);
}

export {
  fillImageData,
  detectAreas,
  addNoise,
  areSamePixels
};
