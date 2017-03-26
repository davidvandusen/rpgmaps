function coordsFromDataPoint(i, w, components = 4) {
  const n = Math.floor(i / components);
  return [n % w, Math.floor(n / w)];
}

function fillImageData(imageData, color) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = color[0];
    data[i + 1] = color[1];
    data[i + 2] = color[2];
    data[i + 3] = color[3] || 0xff;
  }
}

function countPixelColors(imageData) {
  const data = imageData.data;
  let colors = {};
  for (let i = 0; i < data.length; i += 4) {
    const color = `rgba(${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]})`;
    if (!colors[color]) colors[color] = 0;
    colors[color]++;
  }
  return colors;
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
    if (!areas.some(area => isIndexActiveInArea(index, area)))
      return index;
  return -1;
}

function detectAreas(imageData) {
  let pixels = new Uint32Array(imageData.data.buffer);
  return detectAreasRecursive(pixels, imageData.width, []);
}

function detectAreasRecursive(pixels, width, areas) {
  const startIndex = firstUnincludedPixel(pixels.length, areas);
  if (startIndex === -1) return Promise.resolve(areas);
  else return contiguousArea(pixels, width, startIndex)
    .then(area => detectAreasRecursive(pixels, width, areas.concat([area])));
}

function contiguousArea(pixels, width, startIndex) {
  return new Promise((resolve, reject) => {
    const targetColor = pixels[startIndex];
    let area = new Uint8Array(Math.ceil(pixels.length / 8));
    (function floodFill(index) {
      if (isIndexActiveInArea(index, area)) return Promise.resolve();
      if (pixels[index] !== targetColor) return Promise.resolve();
      setIndexActiveInArea(index, area);
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
    }(startIndex)).then(() =>
      resolve(area));
  });
}

export {
  coordsFromDataPoint,
  fillImageData,
  countPixelColors,
  detectAreas
};
