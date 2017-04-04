import AreaMask from '../AreaMask';

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

function outline(mask) {
  const points = [];
  let index;
  let i = 0;
  while (index === undefined && i < mask.size) {
    if (mask.get(i)) index = i;
    else i++;
  }
  const width = mask.width;
  while (index !== points[0]) {
    const last = points[points.length - 1];
    points.push(index);
    const se = mask.get(index);
    const ne = mask.get(index - width);
    const sw = mask.get(index - 1);
    const nw = mask.get(index - width - 1);
    const e = index + 1;
    const s = index + width;
    const w = index - 1;
    const n = index - width;
    if (se !== ne && last !== e) index = e;
    else if (se !== sw && last !== s) index = s;
    else if (nw !== sw && last !== w) index = w;
    else if (nw !== ne && last !== n) index = n;
    else break;
  }
  return points;
}

export {
  fillImageData,
  detectAreas,
  outline
};
