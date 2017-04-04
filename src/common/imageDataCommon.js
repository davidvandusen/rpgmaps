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

function outlineMask(mask) {
  let currentIndex;
  for (let i = 0; currentIndex === undefined && i < mask.size; i++) if (mask.get(i)) currentIndex = i;
  const indices = [];
  while (currentIndex !== indices[0]) {
    indices.push(currentIndex);
    const se = mask.get(currentIndex);
    const ne = mask.get(currentIndex - mask.width);
    const sw = mask.get(currentIndex - 1);
    const nw = mask.get(currentIndex - mask.width - 1);
    const e = currentIndex + 1;
    const s = currentIndex + mask.width;
    const w = currentIndex - 1;
    const n = currentIndex - mask.width;
    const lastIndex = indices[indices.length - 2];
    if (lastIndex === w) {
      if (se !== sw) currentIndex = s;
      else if (se !== ne) currentIndex = e;
      else if (nw !== ne) currentIndex = n;
    } else if (lastIndex === n) {
      if (nw !== sw) currentIndex = w;
      else if (se !== sw) currentIndex = s;
      else if (se !== ne) currentIndex = e;
    } else if (lastIndex === e) {
      if (nw !== ne) currentIndex = n;
      else if (nw !== sw) currentIndex = w;
      else if (se !== sw) currentIndex = s;
    } else if (lastIndex === s || lastIndex === undefined) {
      if (se !== ne) currentIndex = e;
      else if (nw !== ne) currentIndex = n;
      else if (nw !== sw) currentIndex = w;
    }
  }
  const points = [];
  for (let i = 0; i < indices.length; i++) points.push(mask.coords(indices[i]));
  return points;
}

function smoothOutline(outline, amount) {
  const amt = Math.floor(amount);
  const n = amt * 2;
  const points = [];
  for (let i = 0; i < outline.length; i++) {
    let sx = 0;
    let sy = 0;
    for (let p = i - amt; p < i + amt; p++) {
      const index = p < 0 ? outline.length + p : p >= outline.length ? p - outline.length : p;
      sx += outline[index][0];
      sy += outline[index][1];
    }
    points.push([sx / n, sy / n]);
  }
  return points;
}

export {
  fillImageData,
  detectAreas,
  outlineMask,
  smoothOutline
};
