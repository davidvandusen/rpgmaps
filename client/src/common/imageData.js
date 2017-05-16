const seedrandom = require('seedrandom');
const AreaMask = require('./AreaMask');

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

function addNoise(imageData, amount) {
  const rng = seedrandom('');
  for (let i = 0; i < imageData.data.length; i += 4) {
    const by = (rng() * 2 - 1) * amount;
    imageData.data[i] += by;
    imageData.data[i + 1] += by;
    imageData.data[i + 2] += by;
  }
}

function blendOnto(dst, src, amount = 1) {
  const srcData = src.data;
  const dstData = dst.data;
  for (let i = 0; i < srcData.length; i += 4) {
    const srcAlpha = srcData[i + 3];
    if (srcAlpha === 0) continue;
    const dstAlpha = dstData[i + 3];
    const srcOpacity = srcAlpha / 0xff * amount;
    const dstOpacity = dstAlpha / 0xff - srcOpacity;
    dstData[i] = Math.floor(srcData[i] * srcOpacity) + Math.ceil(dstData[i] * dstOpacity);
    dstData[i + 1] = Math.floor(srcData[i + 1] * srcOpacity) + Math.ceil(dstData[i + 1] * dstOpacity);
    dstData[i + 2] = Math.floor(srcData[i + 2] * srcOpacity) + Math.ceil(dstData[i + 2] * dstOpacity);
  }
  return dst;
}

module.exports = {
  blendOnto,
  describeContiguousArea,
  fillImageData,
  imageDataToAreaDescriptors,
  addNoise,
  areSamePixels
};
