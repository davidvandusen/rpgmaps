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

function imageDataToAreaDescriptors(imageData) {
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
  return new Promise((resolve, reject) =>
    setTimeout(() =>
      resolve(describeContiguousArea(pixels, width, startIndex)), 0))
    .then(area =>
      detectAreasRecursive(pixels, width, areas.concat([area])));
}

function describeContiguousArea(pixels, width, startIndex) {
  const mask = new AreaMask(pixels.length, width);
  const color = pixels[startIndex];
  const stack = [startIndex];
  let index;
  while ((index = stack.pop()) !== undefined) {
    do index--; while (index % width !== width - 1 && pixels[index] === color);
    index++;
    let spanAbove = false;
    let spanBelow = false;
    do {
      mask.set(index, true);
      const indexAbove = index - width;
      const indexAboveValid = indexAbove >= 0;
      if (!spanAbove && indexAboveValid && pixels[indexAbove] === color && !mask.get(indexAbove)) {
        stack.push(indexAbove);
        spanAbove = true;
      } else if (spanAbove && indexAboveValid && pixels[indexAbove] !== color) {
        spanAbove = false;
      }
      const indexBelow = index + width;
      const indexBelowValid = indexBelow < pixels.length;
      if (!spanBelow && indexBelowValid && pixels[indexBelow] === color && !mask.get(indexBelow)) {
        stack.push(indexBelow);
        spanBelow = true;
      } else if (spanBelow && indexBelowValid && pixels[indexBelow] !== color) {
        spanBelow = false;
      }
      index++;
    } while (index % width !== 0 && pixels[index] === color);
  }
  return {color, mask};
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
  describeContiguousArea,
  fillImageData,
  imageDataToAreaDescriptors,
  addNoise,
  areSamePixels
};
