function coordsFromDataPoint(i, w, components = 4) {
  const n = Math.floor(i / components);
  return [n % w, Math.floor(n / w)];
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

function isIndexActiveInArea(index, area) {
  const word = Math.floor(index / 8);
  const bit = index % 8;
  return !!(area[word] & 1 << bit);
}

function setIndexActiveInArea(index, area) {
  const word = Math.floor(index / 8);
  const bit = index % 8;
  area[word] |= 1 << bit;
}

function firstUnincludedPixel(length, areas) {
  if (!areas.length) return 0;
  for (let index = 0; index < length; index++)
    if (!areas.some(area => isIndexActiveInArea(index, area.data)))
      return index;
  return -1;
}


function detectAreas(imageData) {
  let pixels = new Uint32Array(imageData.data.buffer);
  return detectAreasRecursive(pixels, imageData.width, []);
}

let detectAreasRecursiveTimeoutIds = [];

function detectAreasRecursive(pixels, width, areas) {
  let timeoutId;
  while (timeoutId = detectAreasRecursiveTimeoutIds.pop()) clearTimeout(timeoutId);
  const startIndex = firstUnincludedPixel(pixels.length, areas);
  if (startIndex === -1) return Promise.resolve(areas);
  else return describeContiguousArea(pixels, width, startIndex)
    .then(area => detectAreasRecursive(pixels, width, areas.concat([area])));
}

function describeContiguousArea(pixels, width, startIndex) {
  return new Promise((resolve, reject) => {
    const color = pixels[startIndex];
    let data = new Uint8Array(Math.ceil(pixels.length / 8));
    (function floodFill(index) {
      if (isIndexActiveInArea(index, data)) return Promise.resolve();
      if (pixels[index] !== color) return Promise.resolve();
      setIndexActiveInArea(index, data);
      const nextIndices = [];
      if (index >= width) nextIndices.push(index - width);
      if (index % width !== width - 1) nextIndices.push(index + 1);
      if (pixels.length >= index + width) nextIndices.push(index + width);
      if (index > 0 && index % width > 0) nextIndices.push(index - 1);
      return Promise.all(
        nextIndices.map(index =>
          new Promise((resolve, reject) =>
            detectAreasRecursiveTimeoutIds.push(
              setTimeout(() =>
                resolve(floodFill(index)), 0)))));
    }(startIndex)).then(() =>
      resolve({color, data}));
  });
}

export {
  coordsFromDataPoint,
  fillImageData,
  detectAreas
};
