function coordsFromDataPoint(i, w, components = 1) {
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

function isBitActiveInBytes(index, bytes) {
  const word = Math.floor(index / 8);
  const bit = index % 8;
  return !!(bytes[word] & 1 << bit);
}

function setBitActiveInBytes(index, bytes) {
  const word = Math.floor(index / 8);
  const bit = index % 8;
  bytes[word] |= 1 << bit;
}

function firstUnincludedPixel(length, areas) {
  if (!areas.length) return 0;
  for (let index = 0; index < length; index++)
    if (!areas.some(area => isBitActiveInBytes(index, area.data)))
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
      if (isBitActiveInBytes(index, data)) return Promise.resolve();
      if (pixels[index] !== color) return Promise.resolve();
      setBitActiveInBytes(index, data);
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

function outlinePoints(data, width) {
  return [5, 5, 5, 10, 10, 10, 10, 5];
}


export {
  coordsFromDataPoint,
  fillImageData,
  detectAreas,
  isBitActiveInBytes,
  setBitActiveInBytes,
  outlinePoints
};
